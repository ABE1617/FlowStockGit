const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');
const notificationController = require('../Controller/notificationController');
const { User } = require('../Model');
const fs = require('fs');
const path = require('path');



function calculateSubscriptionEnd(start, durationStr) {
  if (!start || !durationStr) return null;
  const [amountStr, unit] = durationStr.trim().toLowerCase().split(' ');
  const amount = parseInt(amountStr);
  if (isNaN(amount)) return null;

  const startDate = new Date(start);
  if (unit.startsWith('day')) {
    startDate.setDate(startDate.getDate() + amount);
  } else if (unit.startsWith('month')) {
    startDate.setMonth(startDate.getMonth() + amount);
  }
  return startDate;
}


//Generate random 8-character password
const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Get all users
router.get('/admin/users', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).send("Failed to fetch users: " + err.message);
  }
});

// Toggle user activation
const sendEmail = require('../utils/mailer');

router.post('/admin/activate/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send("User not found");

  user.is_active = !user.is_active;
  await user.save();

  const action = user.is_active ? 'activated' : 'deactivated';
  res.send(`User ${action}`);
  await sendEmail(
    user.email,
    `Your FlowStock account has been ${action}`,
    `<p>Hello ${user.first_name},</p><p>Your account has been <strong>${action}</strong> by the admin.</p>`
  );

  
});


// Toggle user role
router.post('/admin/role/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send("User not found");
  
    user.role = req.body.role;
    await user.save();
    res.send("User role updated");
  });
  

// Delete a user
router.delete('/admin/delete/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).send("User not found");

  await user.destroy();
  res.send("User deleted");
});

// Add a new user

  

  // Add subscription check to server startup
const { checkAndUpdateSubscriptions } = require('../utils/subscription');
setInterval(checkAndUpdateSubscriptions, 1000 * 60 * 60); // Check every hour

router.put('/admin/users/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).send("User not found");
  
      const { first_name, last_name, email, store_name, birthday, role, is_active, subscription_start, subscription_duration } = req.body;
const subscription_end = calculateSubscriptionEnd(subscription_start, subscription_duration);

Object.assign(user, {
  first_name, last_name, email, store_name, birthday,
  role, is_active, subscription_start, subscription_end
});

  
      await user.save();
      res.send("User updated");
    } catch (err) {
      res.status(500).send("Failed to update user: " + err.message);
    }
  });
  

  // Final version: Create user + notify all admins
  router.post('/admin/user', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        store_name,
        email,
        birthday,
        role,
        is_active,
        subscription_start,
        subscription_duration
      } = req.body;
  
      // ✅ Check if email exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
  
      // ✅ Generate and hash password
      const plainPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
      // ✅ Calculate subscription_end if needed
      let subscription_end = null;
      if (role === 'user' && subscription_start && subscription_duration) {
        subscription_end = new Date(subscription_start);
        subscription_end.setDate(subscription_end.getDate() + parseInt(subscription_duration));
      }
  
      // ✅ Create the user
      const newUser = await User.create({
        first_name,
        last_name,
        store_name,
        email,
        password: hashedPassword,
        birthday,
        role,
        is_active: !!is_active,
        subscription_start: subscription_start || null,
        subscription_duration: subscription_duration || null,
        subscription_end
      });
      res.status(201).json(newUser);
      // ✅ Save credentials to file
      const credentials = {
        email: newUser.email,
        password: plainPassword,
        login_link: 'https://yourapp.com/login' // Replace with your real link
      };
      const filePath = path.join(__dirname, `../logins/${newUser.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Ensure directory exists
      fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  
      // ✅ Send email to the new user
      await sendEmail(
        [newUser.email],
        'Your FlowStock Account Details',
        `<p>Hello ${newUser.first_name},</p>
        <p>Your FlowStock account has been created. Here are your login details:</p>
        <ul>
          <li><strong>Email:</strong> ${newUser.email}</li>
          <li><strong>Password:</strong> ${plainPassword}</li>
          <li><strong>Login here:</strong> <a href="https://yourapp.com/login">FlowStock Login</a></li>
        </ul>
        <p>Please change your password after logging in.</p>`
      );
  

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating user' });
    }
  });


  
  
  

  router.put('/user/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).send("User not found");
  
      await user.update(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  


module.exports = router;

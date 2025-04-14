const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');
const { User } = require('../Model');

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
router.post('/admin/users', authenticate, authorizeRoles('admin'), async (req, res) => {
    try {
      const { first_name, last_name, email, password, birthday, store_name, role } = req.body;
  
      const { subscription_start, subscription_duration } = req.body;
const subscription_end = calculateSubscriptionEnd(subscription_start, subscription_duration);

const newUser = await User.create({
  first_name,
  last_name,
  store_name,
  email,
  birthday,
  role,
  is_active: false, // Initially inactive
  subscription_start,
  subscription_end
});

  
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send("Failed to create user: " + err.message);
    }
  });
  
  

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
  

  router.post('/admin/user', authenticate, authorizeRoles('admin'), async (req, res) => {
    const { first_name, last_name, store_name, email, birthday, role, is_active } = req.body;
  
    try {
      // Check if email exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
  
      // Create new user
      const newUser = await User.create({
        first_name,
        last_name,
        store_name,
        email,
        birthday,
        role,
        is_active
      });
  
      // Notify all admins
      const admins = await User.findAll({ where: { role: 'admin' } });
      const emails = admins.map(admin => admin.email);
  
      await sendEmail(
        emails,
        'New FlowStock User Created',
        `<p>A new user has been added: <strong>${newUser.first_name} ${newUser.last_name}</strong> (${newUser.email})</p>`
      );
  
      return res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.error('❌ Error creating user:', err.message);
      return res.status(500).json({ message: 'Error creating user', error: err.message });
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

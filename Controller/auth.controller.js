const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../Model');

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res) => {
  const { first_name, last_name, store_name, birthday, email, password, confirm_password } = req.body;
  if (password !== confirm_password) return res.status(400).send("Passwords don't match");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      first_name,
      last_name,
      store_name,
      birthday,
      email,
      password: hashedPassword,
      role: 'user',
      is_active: false
    });
    res.status(201).send("Registration successful, wait for admin approval.");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send("User not found");
    if (!user.is_active) return res.status(403).send("Account not active");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    const token = createToken(user);
    res.json({ token }); // Send token to frontend
  } catch (err) {
    res.status(500).send("Login error: " + err.message);
  }
};

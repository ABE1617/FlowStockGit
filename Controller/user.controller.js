const db = require("../Model");
const User = db.user;

exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.findOne = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const [updated] = await User.update(req.body, { where: { id } });
  if (updated) res.json({ message: "User updated" });
  else res.status(404).json({ error: "User not found" });
};

exports.delete = async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (deleted) res.json({ message: "User deleted" });
  else res.status(404).json({ error: "User not found" });
};
exports.changeRole = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
  
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: "Role is required" });
  
    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}` });
  };
  

exports.toggleActive = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User is now ${user.isActive ? "enabled" : "disabled"}` });
};

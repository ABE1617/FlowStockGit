const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/user', authenticate, authorizeRoles('user'), (req, res) => {
  res.send(`Welcome user ${req.user.id}`);
});

module.exports = router;
router.get('/subscription/status', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send("User not found");

    res.json({
      is_active: user.is_active,
      subscription_start: user.subscription_start,
      subscription_end: user.subscription_end
    });
  } catch (err) {
    res.status(500).send("Error checking subscription: " + err.message);
  }
});

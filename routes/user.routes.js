const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/user', authenticate, authorizeRoles('user'), (req, res) => {
  res.send(`Welcome user ${req.user.id}`);
});

module.exports = router;


const { User } = require('../Model');

async function checkAndUpdateSubscriptions() {
  try {
    const users = await User.findAll({
      where: {
        is_active: true,
        subscription_end: {
          [Op.not]: null,
          [Op.lt]: new Date()
        }
      }
    });

    for (const user of users) {
      user.is_active = false;
      await user.save();
    }
  } catch (err) {
    console.error('Error checking subscriptions:', err);
  }
}

module.exports = { checkAndUpdateSubscriptions };

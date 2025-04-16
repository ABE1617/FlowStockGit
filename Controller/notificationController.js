const { Notification, User } = require('../Model');
const { Op } = require('sequelize'); // ✅ Make sure you import Op!

const sendNotification = async (req, res) => {
  try {
    const { title, message, filter_type } = req.body;
    let users = [];

    if (filter_type === 'disabled') {
      users = await User.findAll({ where: { is_active: false } });
    } else if (filter_type === 'active_with_valid_sub') {
      users = await User.findAll({
        where: {
          is_active: true,
          subscription_end: {
            [Op.gt]: new Date()
          }
        }
      });
    } else if (filter_type === 'active_with_expired_sub') {
      users = await User.findAll({
        where: {
          is_active: true,
          [Op.or]: [
            { subscription_end: null },
            { subscription_end: { [Op.lte]: new Date() } }
          ]
        }
      });
    }

    const notification = await Notification.create({
      title,
      message,
      filter_type,
      sent_to_count: users.length
    });

    // Optionally: log the target users
    console.log("Notification sent to users:", users.map(u => u.email));

    res.json({ message: 'Notification sent and saved.', notification });

  } catch (err) {
    console.error("Error in sendNotification:", err);
    res.status(500).json({ error: 'Failed to send notification', details: err.message });
  }
};

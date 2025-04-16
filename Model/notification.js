// models/Notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      filter_type: DataTypes.STRING,
      sent_to_count: DataTypes.INTEGER
    });
  
    return Notification;
  };
  
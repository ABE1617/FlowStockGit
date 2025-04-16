
module.exports = (sequelize, DataTypes) => {
  const SubscriptionHistory = sequelize.define('SubscriptionHistory', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return SubscriptionHistory;
};

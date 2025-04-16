
module.exports = (sequelize, DataTypes) => {
  const Return = sequelize.define('Return', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: DataTypes.TEXT,
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Return;
};

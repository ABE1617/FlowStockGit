
module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Provider;
};

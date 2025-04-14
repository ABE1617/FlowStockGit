// user.model.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      store_name: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      subscription_start: {
        type: DataTypes.DATE,
        allowNull: true
      },
      subscription_end: {
        type: DataTypes.DATE,
        allowNull: true
      },
      
    });
  
    return User;
  };
  
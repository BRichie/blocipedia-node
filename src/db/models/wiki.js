'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {

    
    title:{
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    }
  }, {});
  Wiki.associate = function(models) {

    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    // associations can be defined here
  };
  return Wiki;
};
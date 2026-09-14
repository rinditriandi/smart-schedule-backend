'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pss extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Pss.belongsToMany(models.Schedule, { through: models.PssSchedule })
      Pss.hasMany(models.PssSchedule, { foreignKey: 'PssId' })
    }
  };
  Pss.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'name cannot be empty' },
        notEmpty: { msg: 'name cannot be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'email has been used' },
      validate: {
        notNull: { msg: 'email cannot be empty' },
        notEmpty: { msg: 'email cannot be empty' },
        isEmail: { msg: 'invalid format email' }
      }
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'alias has been used' },
      validate: {
        notNull: { msg: 'alias cannot be empty' },
        notEmpty: { msg: 'alias cannot be empty' }
      }
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'created at cannot be empty' },
        notEmpty: { msg: 'created at cannot be empty' }
      }
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'updated at cannot be empty' },
        notEmpty: { msg: 'updated at cannot be empty' }
      }
    },
  }, {
    sequelize,
    modelName: 'Pss',
    tableName: 'Pss',
    timestamps: false
  });
  return Pss;
};
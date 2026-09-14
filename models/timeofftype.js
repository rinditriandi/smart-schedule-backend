'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeoffType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TimeoffType.belongsTo(models.ActivityType, { foreignKey: 'ActivityTypeId' })
    }
  };
  TimeoffType.init({
    apiName: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: { msg: 'api name has been used' },
      validate: {
        notNull: { msg: 'api name cannot be empty' },
        notEmpty: { msg: 'api name cannot be empty' }
      }
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'label cannot be empty' },
        notEmpty: { msg: 'label cannot be empty' }
      }
    },
    ActivityTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'activity type id cannot be empty' },
        notEmpty: { msg: 'activity type id cannot be empty' }
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
    modelName: 'TimeoffType',
    tableName: 'TimeoffTypes',
    timestamps: false
  });
  return TimeoffType;
};
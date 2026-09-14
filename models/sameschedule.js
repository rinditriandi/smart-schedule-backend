'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SameSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SameSchedule.belongsTo(models.Schedule, { foreignKey: 'Schedule1', as: 'SameSchedule1' })
      SameSchedule.belongsTo(models.Schedule, { foreignKey: 'Schedule2', as: 'Schedule' })
      SameSchedule.belongsTo(models.Consultant, { foreignKey: 'ConsultantId' })
    }
  };
  SameSchedule.init({
    ConsultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'consultant id cannot be empty' },
        notEmpty: { msg: 'consultant id cannot be empty' }
      }
    },
    Schedule1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule1 cannot be empty' },
        notEmpty: { msg: 'schedule1 cannot be empty' }
      }
    },
    Schedule2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule2 cannot be empty' },
        notEmpty: { msg: 'schedule2 cannot be empty' }
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
    modelName: 'SameSchedule',
    tableName: 'SameSchedules',
    timestamps: false
  });
  return SameSchedule;
};
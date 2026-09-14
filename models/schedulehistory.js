'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScheduleHistory.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' })
      ScheduleHistory.hasMany(models.ScheduleHistoryAfter, { foreignKey: 'ScheduleHistoryId' })
      ScheduleHistory.hasMany(models.ScheduleHistoryBefore, { foreignKey: 'ScheduleHistoryId' })
    }
  };
  ScheduleHistory.init({
    ScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule id cannot be empty' },
        notEmpty: { msg: 'schedule id cannot be empty' }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'type cannot be empty' },
        notEmpty: { msg: 'type cannot be empty' }
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'created by cannot be empty' },
        notEmpty: { msg: 'created by cannot be empty' }
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
    modelName: 'ScheduleHistory',
    tableName: 'ScheduleHistories',
    timestamps: false
  });
  return ScheduleHistory;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleHistoryAfter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScheduleHistoryAfter.belongsTo(models.ScheduleHistory, { foreignKey: 'ScheduleHistoryId' })
      ScheduleHistoryAfter.belongsTo(models.ActivityType, { foreignKey: 'ActivityTypeId' })
    }
  };
  ScheduleHistoryAfter.init({
    ScheduleHistoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule history id cannot be empty' },
        notEmpty: { msg: 'schedule history id cannot be empty' }
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
    startHours: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'start hours cannot be empty' },
        notEmpty: { msg: 'start hours cannot be empty' }
      }
    },
    endHours: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'end hours cannot be empty' },
        notEmpty: { msg: 'end hours cannot be empty' }
      }
    },
    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'date cannot be empty' },
        notEmpty: { msg: 'date cannot be empty' }
      }
    },
    gcalEventId: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
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
    modelName: 'ScheduleHistoryAfter',
    tableName: 'ScheduleHistoryAfter',
    timestamps: false
  });
  return ScheduleHistoryAfter;
};
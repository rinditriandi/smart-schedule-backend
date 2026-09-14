'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Schedule.hasMany(models.ConsultantSchedule, { foreignKey: 'ScheduleId' })
      Schedule.hasMany(models.PssSchedule, { foreignKey: 'ScheduleId' })
      Schedule.hasMany(models.ScheduleHistory, { foreignKey: 'ScheduleId' })
      Schedule.hasMany(models.ScheduleAttendee, { foreignKey: 'ScheduleId' })
      Schedule.hasMany(models.SameSchedule, { foreignKey: 'Schedule1' })
      Schedule.hasMany(models.ScheduleRequirement, { foreignKey: 'ScheduleId' })
      Schedule.belongsToMany(models.Consultant, { through: 'ConsultantSchedule' })
      Schedule.belongsToMany(models.Requirement, { through: 'ScheduleRequirement' })
      Schedule.belongsTo(models.ActivityType, { foreignKey: 'ActivityTypeId' })
      Schedule.belongsTo(models.Plot, { foreignKey: 'PlotId' })
      Schedule.belongsTo(models.ClassType, { foreignKey: 'ClassTypeId' })
    }
  };
  Schedule.init({
    ActivityTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'activity type id cannot be empty' },
        notEmpty: { msg: 'activity type id cannot be empty' }
      }
    },
    PlotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'plot id cannot be empty' },
        notEmpty: { msg: 'plot id cannot be empty' }
      }
    },
    location: {
      type: DataTypes.TEXT
    },
    isSyncGcal: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.getDataValue('gcalEventId')) {
          return true
        } else {
          return false
        }
      }
    },
    gcalEventId: {
      type: DataTypes.STRING
    },
    gcalEventStatus: {
      type: DataTypes.TEXT
    },
    gcalSummary: {
      type: DataTypes.TEXT
    },
    isCanceled: {
      type: DataTypes.BOOLEAN
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    },
    ClassTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'class type id cannot be empty' },
        notEmpty: { msg: 'class type id cannot be empty' }
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'date cannot be empty' },
        notEmpty: { msg: 'date cannot be empty' }
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
    startHoursString: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${new Date(this.getDataValue('startHours'))}`
      }
    },
    totalMinutes: {
      type: DataTypes.VIRTUAL,
      get() {
        const breakDuration_ = this.getDataValue('breakDuration') ? Number(this.getDataValue('breakDuration')) : 0

        const minutesDuration = (Number(this.getDataValue('endHours')) - this.getDataValue('startHours') - Number(breakDuration_)) / 1000 / 60

        return minutesDuration
      }
    },
    totalHours: {
      type: DataTypes.VIRTUAL,
      get() {
        const breakDuration_ = this.getDataValue('breakDuration') ? Number(this.getDataValue('breakDuration')) : 0

        const hoursDuration = (Number(this.getDataValue('endHours')) - this.getDataValue('startHours') - Number(breakDuration_)) / 1000 / 3600

        return hoursDuration
      }
    },
    breakDuration: {
      type: DataTypes.BIGINT
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
    modelName: 'Schedule',
    tableName: 'Schedules',
    timestamps: false
  });
  return Schedule;
};
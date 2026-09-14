'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleAttendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScheduleAttendee.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' })
    }
  };
  ScheduleAttendee.init({
    ScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule id cannot be empty' },
        notEmpty: { msg: 'schedule id cannot be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'email cannot be empty' },
        notEmpty: { msg: 'email cannot be empty' },
        isEmail: { msg: 'invalid format email' }
      }
    },
    name: {
      type: DataTypes.STRING
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
    modelName: 'ScheduleAttendee',
    tableName: 'ScheduleAttendees',
    timestamps: false
  });
  return ScheduleAttendee;
};
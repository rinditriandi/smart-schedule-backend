'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConsultantSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConsultantSchedule.belongsTo(models.Consultant, { foreignKey: 'ConsultantId' })
      ConsultantSchedule.belongsTo(models.ConsultantType, { foreignKey: 'ConsultantTypeId' })
      ConsultantSchedule.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' })
    }
  };
  ConsultantSchedule.init({
    ConsultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'consultant id cannot be empty' },
        notEmpty: { msg: 'consultant id cannot be empty' }
      }
    },
    ConsultantTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'consultant type id cannot be empty' },
        notEmpty: { msg: 'consultant type id cannot be empty' }
      }
    },
    ScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule id cannot be empty' },
        notEmpty: { msg: 'schedule id cannot be empty' }
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
    modelName: 'ConsultantSchedule',
    tableName: 'ConsultantSchedules',
    timestamps: false
  });
  return ConsultantSchedule;
};
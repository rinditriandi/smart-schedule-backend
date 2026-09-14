'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleRequirement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScheduleRequirement.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' })
      ScheduleRequirement.belongsTo(models.Requirement, { foreignKey: 'RequirementId' })
    }
  };
  ScheduleRequirement.init({
    ScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'schedule id cannot be empty' },
        notEmpty: { msg: 'schedule id cannot be empty' }
      }
    },
    RequirementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'requirement id cannot be empty' },
        notEmpty: { msg: 'requirement id cannot be empty' }
      }
    },
    isReady: {
      type: DataTypes.BOOLEAN
    },
    note: {
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
    hooks: {
      beforeValidate: scheduleRequirement => {
        scheduleRequirement.dataValues.createdAt = new Date().getTime()
        scheduleRequirement.dataValues.updatedAt = new Date().getTime()
      },
      beforeUpdate: scheduleRequirement => {
        scheduleRequirement.dataValues.updatedAt = new Date().getTime()
      }
    },
    modelName: 'ScheduleRequirement',
    tableName: 'ScheduleRequirements',
    timestamps: false
  });
  return ScheduleRequirement;
};
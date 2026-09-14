'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PssSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PssSchedule.belongsTo(models.PssType, { foreignKey: 'PssTypeId' })
      PssSchedule.belongsTo(models.Pss, { foreignKey: 'PssId' })
      PssSchedule.belongsTo(models.Schedule, { foreignKey: 'ScheduleId' })
    }
  };
  PssSchedule.init({
    PssId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'pss id cannot be empty' },
        notEmpty: { msg: 'pss id cannot be empty' }
      }
    },
    PssTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'pss type id cannot be empty' },
        notEmpty: { msg: 'pss type id cannot be empty' }
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
    modelName: 'PssSchedule',
    tableName: 'PssSchedules',
    timestamps: false
  });
  return PssSchedule;
};
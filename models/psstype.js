'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PssType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PssType.hasMany(models.PssSchedule, { foreignKey: 'PssTypeId' })
    }
  };
  PssType.init({
    apiName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'api name has been used' },
      validate: {
        notNull: { msg: 'api name cannot be empty' },
        notEmpty: { msg: 'api name cannot be empty' }
      }
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'label cannot be empty' },
        notEmpty: { msg: 'label cannot be empty' }
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
    modelName: 'PssType',
    tableName: 'PssTypes',
    timestamps: false
  });
  return PssType;
};
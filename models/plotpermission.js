'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlotPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlotPermission.belongsTo(models.Plot, { foreignKey: 'PlotId' })
    }
  };
  PlotPermission.init({
    PlotId: {
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
        notEmpty: { msg: 'email cannot be empty' }
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
    modelName: 'PlotPermission',
    tableName: 'PlotPermissions',
    timestamps: false
  });
  return PlotPermission;
};
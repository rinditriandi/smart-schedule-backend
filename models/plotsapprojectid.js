'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlotSapProjectId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlotSapProjectId.belongsTo(models.Plot, { foreignKey: 'PlotId' })
    }
  };
  PlotSapProjectId.init({
    PlotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'plot id cannot be empty' },
        notEmpty: { msg: 'plot id cannot be empty' }
      }
    },
    sapProjectId: {
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
    modelName: 'PlotSapProjectId',
    tableName: 'PlotSapProjectId',
    timestamps: false
  });
  return PlotSapProjectId;
};
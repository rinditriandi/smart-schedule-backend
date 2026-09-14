'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Plot.hasMany(models.PlotPermission, { foreignKey: 'PlotId' })
      Plot.hasMany(models.Schedule, { foreignKey: 'PlotId' })
      Plot.hasOne(models.PlotSapProjectId, { foreignKey: 'PlotId' })
    }
  };
  Plot.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'name cannot be empty' },
        notEmpty: { msg: 'name cannot be empty' }
      }
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'topic cannot be empty' },
        notEmpty: { msg: 'topic cannot be empty' }
      }
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'client cannot be empty' },
        notEmpty: { msg: 'client cannot be empty' }
      }
    },
    group: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'group cannot be empty' },
        notEmpty: { msg: 'group cannot be empty' }
      }
    },
    OpportunityId: {
      type: DataTypes.TEXT
    },
    odooWbsId: {
      type: DataTypes.INTEGER
    },
    profitCenter: {
      type: DataTypes.TEXT
    },
    programCategory: {
      type: DataTypes.TEXT
    },
    wbs: {
      type: DataTypes.TEXT
    },
    wbsPeriod: {
      type: DataTypes.BIGINT
    },
    wbsPeriodString: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${new Date(this.getDataValue('wbsPeriod'))}`
      }
    },
    salesPeriod: {
      type: DataTypes.BIGINT
    },
    sales: {
      type: DataTypes.INTEGER
    },
    planHours: {
      type: DataTypes.BIGINT
    },
    sapId: {
      type: DataTypes.TEXT
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    },
    isCanceled: {
      type: DataTypes.BOOLEAN
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
    modelName: 'Plot',
    tableName: 'Plots',
    timestamps: false
  });
  return Plot;
};
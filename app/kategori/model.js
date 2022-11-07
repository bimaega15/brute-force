const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config");

const Kategori = sequelize.define(
  "kategori",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_kategori: {
      type: DataTypes.STRING,
    },
    gambar_kategori: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    keterangan_kategori: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "kategori",
  }
);

module.exports = { Kategori };

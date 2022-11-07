const { DataTypes, Deferrable } = require("sequelize");
const { sequelize } = require("../../config");
const { Kategori } = require("../kategori/model");

const Berita = sequelize.define(
  "berita",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Kategori,
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    judul_berita: {
      type: DataTypes.STRING,
    },
    tanggal_berita: {
      type: DataTypes.DATEONLY,
    },
    isi_berita: {
      type: DataTypes.TEXT,
    },
    gambar_berita: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "berita",
  }
);

module.exports = { Berita };

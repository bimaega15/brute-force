const { Kategori } = require("../kategori/model");
const { Berita } = require("../berita/model");
const { Users } = require("../users/model");

Kategori.hasMany(Berita, {
  foreignKey: "kategori_id",
});

Berita.belongsTo(Kategori, {
  foreignKey: "kategori_id",
});

module.exports = {
  Berita,
  Kategori,
  Users,
};

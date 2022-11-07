const { Berita, Kategori } = require("../model");
const { Op } = require("sequelize");
const moment = require("moment");

const getData = async (
  limit = null,
  offset = null,
  search = null,
  filter = {}
) => {
  let berita = "";
  let whereObj = {};
  whereObj.filter = null;
  whereObj.queryLike = null;

  if (filter.id_berita != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id_berita };
  }
  if (filter.kategori_id != null) {
    whereObj.filter = { ...whereObj.filter, kategori_id: filter.kategori_id };
  }
  if (filter.tanggal_berita != null) {
    whereObj.filter = {
      ...whereObj.filter,
      tanggal_berita: moment(filter.tanggal_berita, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      ),
    };
  }
  if (whereObj.filter != null) {
    whereObj.filter = {
      [Op.and]: whereObj.filter,
    };
  }

  if (search != null) {
    whereObj.queryLike = {
      [Op.or]: {
        "$kategori.nama_kategori$": {
          [Op.like]: "%" + search + "%",
        },
        judul_berita: {
          [Op.like]: "%" + search + "%",
        },
        isi_berita: {
          [Op.like]: "%" + search + "%",
        },
      },
    };
  }

  //   execute
  let pushWhere = [];
  berita = await Berita.findAll({
    order: [["id", "asc"]],
    include: [
      {
        model: Kategori,
      },
    ],
  });

  if (search != null) {
    pushWhere.push(whereObj.queryLike);
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }

    berita = await Berita.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
      include: [
        {
          model: Kategori,
        },
      ],
      limit: limit,
      offset: offset,
    });
  }

  if (search == null) {
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }
    berita = await Berita.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
      include: [
        {
          model: Kategori,
        },
      ],
      limit: limit,
      offset: offset,
    });
  }

  // filter
  if (
    limit == null &&
    offset == null &&
    search == null &&
    whereObj.filter != null
  ) {
    pushWhere.push(whereObj.filter);
    berita = await Berita.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
      include: [
        {
          model: Kategori,
        },
      ],
    });
  }

  return berita;
};

const getFindOneData = async (filter = {}) => {
  let berita = "";
  let whereObj = {};
  whereObj.filter = null;

  if (filter.id != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id };
  }
  if (filter.kategori_id != null) {
    whereObj.filter = {
      ...whereObj.filter,
      kategori_id: filter.kategori_id,
    };
  }

  whereObj.filter = {
    [Op.and]: whereObj.filter,
  };

  //   execute
  let pushWhere = [];
  pushWhere.push(whereObj.filter);
  berita = await Berita.findOne({
    order: [["id", "asc"]],
    where: pushWhere,
  });

  return berita;
};

const insertData = async (data) => {
  let berita = "";

  berita = await Berita.create(data);
  return berita;
};

const updateData = async (data, id_berita) => {
  let berita = "";

  berita = await Berita.update(data, {
    where: {
      id: id_berita,
    },
  });
  return berita;
};

const deleteData = async (id_berita) => {
  let berita = "";

  berita = await Berita.destroy({
    where: {
      id: id_berita,
    },
  });
  return berita;
};

module.exports = {
  getData,
  insertData,
  updateData,
  deleteData,
  getFindOneData,
};

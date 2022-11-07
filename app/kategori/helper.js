const { Op } = require("sequelize");
const { Kategori } = require("../model");

const getData = async (
  limit = null,
  offset = null,
  search = null,
  filter = {}
) => {
  let kategori = "";
  let whereObj = {};
  whereObj.filter = null;
  whereObj.queryLike = null;

  if (filter.id != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id };
  }
  if (filter.nama_kategori != null) {
    whereObj.filter = {
      ...whereObj.filter,
      nama_kategori: filter.nama_kategori,
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
        nama_kategori: {
          [Op.like]: "%" + search + "%",
        },
        keterangan_kategori: {
          [Op.like]: "%" + search + "%",
        },
      },
    };
  }

  //   execute
  let pushWhere = [];
  kategori = await Kategori.findAll({
    order: [["id", "asc"]],
  });

  if (search != null) {
    pushWhere.push(whereObj.queryLike);
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }

    kategori = await Kategori.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
      limit: limit,
      offset: offset,
    });
  }

  if (search == null) {
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }

    kategori = await Kategori.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
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
    users = await Users.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
    });
  }

  return kategori;
};

const getFindOneData = async (filter = {}) => {
  let kategori = "";
  let whereObj = {};
  whereObj.filter = null;

  if (filter.id != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id };
  }
  if (filter.nama_kategori != null) {
    whereObj.filter = {
      ...whereObj.filter,
      nama_kategori: filter.nama_kategori,
    };
  }

  whereObj.filter = {
    [Op.and]: whereObj.filter,
  };

  //   execute
  let pushWhere = [];
  pushWhere.push(whereObj.filter);
  kategori = await Kategori.findOne({
    order: [["id", "asc"]],
    where: pushWhere,
  });

  return kategori;
};

const insertData = async (data) => {
  let kategori = "";

  kategori = await Kategori.create(data);
  return kategori;
};

const updateData = async (data, id_kategori) => {
  let kategori = "";

  kategori = await Kategori.update(data, {
    where: {
      id: id_kategori,
    },
  });
  return kategori;
};

const deleteData = async (id_kategori) => {
  let kategori = "";

  kategori = await Kategori.destroy({
    where: {
      id: id_kategori,
    },
  });
  return kategori;
};

module.exports = {
  getData,
  getFindOneData,
  insertData,
  updateData,
  deleteData,
};

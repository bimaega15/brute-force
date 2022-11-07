const { Op, where } = require("sequelize");
const { Users } = require("../model");

const getData = async (
  limit = null,
  offset = null,
  search = null,
  filter = {}
) => {
  let users = "";
  let whereObj = {};
  whereObj.filter = null;
  whereObj.queryLike = null;

  if (filter.id != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id };
  }
  if (filter.username != null) {
    whereObj.filter = { ...whereObj.filter, username: filter.username };
  }

  if (whereObj.filter != null) {
    whereObj.filter = {
      [Op.and]: whereObj.filter,
    };
  }

  //   execute
  users = await Users.findAll({
    order: [["id", "asc"]],
    limit: limit,
    offset: offset,
  });

  let pushWhere = [];
  if (search != null) {
    whereObj.queryLike = {
      [Op.or]: {
        username: {
          [Op.like]: "%" + search + "%",
        },
        email: {
          [Op.like]: "%" + search + "%",
        },
      },
    };
  }

  // search tidak kosong
  if (search != null) {
    pushWhere.push(whereObj.queryLike);
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }

    users = await Users.findAll({
      where: pushWhere,
      order: [["id", "asc"]],
      limit: limit,
      offset: offset,
    });
  }

  // search kosong
  if (search == null) {
    if (whereObj.filter != null) {
      pushWhere.push(whereObj.filter);
    }

    users = await Users.findAll({
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

  return users;
};

const getFindOneData = async (filter = {}, not_id = null) => {
  let users = "";
  let whereObj = {};
  whereObj.filter = null;

  if (filter.id != null) {
    whereObj.filter = { ...whereObj.filter, id: filter.id };
  }
  if (filter.username != null) {
    whereObj.filter = { ...whereObj.filter, username: filter.username };
  }
  if (filter.email != null) {
    whereObj.filter = { ...whereObj.filter, email: filter.email };
  }
  if (not_id != null) {
    whereObj.filter = { ...whereObj.filter, id: { [Op.not]: not_id } };
  }

  whereObj.filter = {
    [Op.and]: whereObj.filter,
  };

  //   execute
  let pushWhere = [];
  pushWhere.push(whereObj.filter);
  users = await Users.findOne({
    order: [["id", "asc"]],
    where: pushWhere,
  });

  return users;
};

const insertData = async (data) => {
  let users = "";

  users = await Users.create(data);
  return users;
};

const updateData = async (data, id_users) => {
  let users = "";

  users = await Users.update(data, {
    where: {
      id: id_users,
    },
  });
  return users;
};

const deleteData = async (id_users) => {
  let users = "";

  users = await Users.destroy({
    where: {
      id: id_users,
    },
  });
  return users;
};

module.exports = {
  getData,
  getFindOneData,
  insertData,
  updateData,
  deleteData,
};

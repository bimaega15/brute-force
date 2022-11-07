const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {
  getData,
  insertData,
  getFindOneData,
  updateData,
  deleteData,
} = require("./helper");
const { Users } = require("./model");
const { pagination } = require("../utils");
const { validationResult } = require("express-validator");

const index = async (req, res) => {
  try {
    // page
    const page =
      req.query.page == null || req.query.page == "" ? 1 : req.query.page;
    const limit =
      req.query.limit == null || req.query.limit == "" ? 10 : req.query.limit;
    const search = req.query.search;

    const halamanAkhir = page * limit;
    const halamanAwal = halamanAkhir - limit;
    const offset = halamanAkhir;
    const skip = halamanAwal;

    let users = await getData(limit, skip, null, {});
    let model = await Users.count();

    if (search != null && search != "") {
      users = await getData(limit, skip, search, {});
      let getModel = await getData(null, null, search);
      model = getModel.length;
    }

    // pagination
    const getPagination = pagination(page, model, limit);

    let keterangan = {
      from: skip + 1,
      to: offset,
      total: model,
    };

    let output = {
      data: users,
      pagination: getPagination,
      keterangan: keterangan,
    };
    return res.status(200).json({
      status: 200,
      message: "Berhasil tangkap data",
      output: output,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid form validation",
        result: errors.array(),
      });
    }

    const { username, password, email } = req.body;
    let insert = insertData({
      username,
      password: bcrypt.hashSync(password, saltRounds),
      email,
    });

    if (insert) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil insert data",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal insert data",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    let filter = {};
    filter.id = id;
    let user = await getFindOneData(filter);
    if (user) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil ambil data",
        result: user,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal ambil data",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid form validation",
        result: errors.array(),
      });
    }

    const { username, password, email, password_old } = req.body;

    let passwordDb = password_old;
    if (password != null) {
      passwordDb = bcrypt.hashSync(password, saltRounds);
    }
    let id = req.params.id;

    let data = {};
    data.username = username;
    data.password = passwordDb;
    data.email = email;

    let update = updateData(data, id);

    if (update) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil update data",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal update data",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const destroyData = async (req, res) => {
  try {
    const { id } = req.params;
    let del = await deleteData(id);
    if (del) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil delete data",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal delete data",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  index,
  create,
  edit,
  update,
  destroyData,
};

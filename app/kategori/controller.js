const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {
  getData,
  insertData,
  updateData,
  deleteData,
  getFindOneData,
} = require("./helper");
const { Kategori } = require("./model");
const { pagination } = require("../utils");
const { validationResult } = require("express-validator");
const moment = require("moment");
const mv = require("mv");
const fs = require("fs");

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

    let kategori = await getData(limit, skip, null, {});
    let model = await Kategori.count();
    if (search != null && search != "") {
      kategori = await getData(limit, skip, search, {});
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
      data: kategori,
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

    const { nama_kategori, gambar_kategori, keterangan_kategori } = req.body;
    let gambar_db = await uploadGambar(gambar_kategori);

    let insert = insertData({
      nama_kategori,
      gambar_kategori: gambar_db,
      keterangan_kategori,
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

    const { nama_kategori, gambar_kategori, keterangan_kategori } = req.body;

    let id = req.params.id;
    let gambar_db = await uploadGambar(gambar_kategori, id);

    let data = {};
    data.nama_kategori = nama_kategori;
    data.gambar_kategori = gambar_db;
    data.keterangan_kategori = keterangan_kategori;

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
    await deleteGambar(id);
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

const uploadGambar = async (responseGambar, id_kategori = null) => {
  if (responseGambar.gambar_kategori != null) {
    const { gambar_kategori } = responseGambar;

    let pathOld = gambar_kategori.filepath;
    let name = gambar_kategori.originalFilename;
    let size = gambar_kategori.size;

    name =
      moment
        .duration(moment(moment().format("YYYY-MM-DD HH:mm:ss")))
        .asSeconds() +
      "_" +
      name.split(" ").join("-");
    pathNew = "public/image/kategori/" + name;
    if (size > 0) {
      if (pathOld != null && pathNew != null) {
        if (id_kategori != null) {
          await deleteGambar(id_kategori);
        }

        mv(pathOld, pathNew, function (err) {
          if (err) {
            return err;
          }
        });

        const fileName = pathNew.split("/");
        const fileDb = fileName[fileName.length - 1];
        return fileDb;
      }
    }
  }

  if (id_kategori != null) {
    let filter = {};
    filter.id = id_kategori;
    let getkategori = await getFindOneData(filter);
    if (
      getkategori.gambar_kategori != "default.png" &&
      getkategori.gambar_kategori != null
    ) {
      return getkategori.gambar_kategori;
    }
  }
  return "default.png";
};

const deleteGambar = async (id_kategori = null) => {
  if (id_kategori != null) {
    let filter = {};
    filter.id = id_kategori;
    let getkategori = await getFindOneData(filter);
    if (
      getkategori.gambar_kategori != "default.png" &&
      getkategori.gambar_kategori != null
    ) {
      let unlink = "public/image/kategori/" + getkategori.gambar_kategori;
      if (fs.existsSync(unlink)) {
        fs.unlinkSync(unlink);
      }
    }
  }
};

module.exports = {
  index,
  create,
  edit,
  update,
  destroyData,
};

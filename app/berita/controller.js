const {
  getData,
  insertData,
  updateData,
  deleteData,
  getFindOneData,
} = require("./helper");
const { Berita } = require("./model");
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

    let berita = await getData(limit, skip, null, {});
    let model = await Berita.count();
    if (search != null && search != "") {
      berita = await getData(limit, skip, search, {});
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
      data: berita,
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

    const {
      kategori_id,
      judul_berita,
      tanggal_berita,
      isi_berita,
      gambar_berita,
    } = req.body;

    let gambar_db = await uploadGambar(gambar_berita);

    let insert = insertData({
      kategori_id,
      judul_berita,
      tanggal_berita: moment(tanggal_berita, "DD-MM-YYYY").format("YYYY-MM-DD"),
      isi_berita,
      gambar_berita: gambar_db,
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
    let berita = await getFindOneData(filter);
    if (berita) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil ambil data",
        result: berita,
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

    const {
      kategori_id,
      judul_berita,
      tanggal_berita,
      isi_berita,
      gambar_berita,
    } = req.body;

    let id = req.params.id;
    let gambar_db = await uploadGambar(gambar_berita, id);

    let data = {};
    data.kategori_id = kategori_id;
    data.judul_berita = judul_berita;
    data.tanggal_berita = moment(tanggal_berita, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    data.isi_berita = isi_berita;
    data.gambar_berita = gambar_db;

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

const uploadGambar = async (responseGambar, id_berita = null) => {
  if (responseGambar.gambar_berita != null) {
    const { gambar_berita } = responseGambar;

    let pathOld = gambar_berita.filepath;
    let name = gambar_berita.originalFilename;
    let size = gambar_berita.size;

    name =
      moment
        .duration(moment(moment().format("YYYY-MM-DD HH:mm:ss")))
        .asSeconds() +
      "_" +
      name.split(" ").join("-");
    pathNew = "public/image/berita/" + name;
    if (size > 0) {
      if (pathOld != null && pathNew != null) {
        if (id_berita != null) {
          await deleteGambar(id_berita);
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

  if (id_berita != null) {
    let filter = {};
    filter.id = id_berita;
    let getberita = await getFindOneData(filter);
    if (
      getberita.gambar_berita != "default.png" &&
      getberita.gambar_berita != null
    ) {
      return getberita.gambar_berita;
    }
  }
  return "default.png";
};

const deleteGambar = async (id_berita = null) => {
  if (id_berita != null) {
    let filter = {};
    filter.id = id_berita;
    let getberita = await getFindOneData(filter);
    if (
      getberita.gambar_berita != "default.png" &&
      getberita.gambar_berita != null
    ) {
      let unlink = "public/image/berita/" + getberita.gambar_berita;
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

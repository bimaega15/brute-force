var express = require("express");
const { body } = require("express-validator");
var router = express.Router();
const formidable = require("formidable");

const { index, create, edit, update, destroyData } = require("./controller");

const formData = (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    req.body = fields;
    req.body.gambar_berita = files;
    if (err) {
      next(err);
    }
    next();
  });
};

router
  .route("/")
  .get(index)
  .post(
    formData,
    body("kategori_id").notEmpty().withMessage("Kategori wajib diisi").trim(),
    body("judul_berita")
      .notEmpty()
      .withMessage("Judul berita wajib diisi")
      .trim(),
    body("tanggal_berita")
      .notEmpty()
      .withMessage("Tanggal berita wajib diisi")
      .trim(),
    body("isi_berita").notEmpty().withMessage("Isi berita wajib diisi").trim(),
    body("gambar_berita").custom(async (value, meta) => {
      const gambar_berita = meta.req.body.gambar_berita;
      if (gambar_berita.size > 0) {
        const imageType = gambar_berita.type;
        const size = gambar_berita.size / 1000000;
        const mimeType = [
          "image/jpeg",
          "image/gif",
          "image/png",
          "image/svg+xml",
        ];
        const byte = 3000000 / 1000000;
        const checkType = mimeType.includes(imageType);
        if (!checkType) {
          return Promise.reject(
            "Format file tidak didukung, format yang didukung yaitu: " +
              mimeType.join(",")
          );
        }
        if (size > byte) {
          return Promise.reject("Ukuran gambar lebih dari 3 mb ");
        }
      }
    }),

    create
  );

router
  .route("/edit/:id")
  .get(edit)
  .put(
    formData,
    body("kategori_id").notEmpty().withMessage("Kategori wajib diisi").trim(),
    body("judul_berita")
      .notEmpty()
      .withMessage("Judul berita wajib diisi")
      .trim(),
    body("tanggal_berita")
      .notEmpty()
      .withMessage("Tanggal berita wajib diisi")
      .trim(),
    body("isi_berita").notEmpty().withMessage("Isi berita wajib diisi").trim(),
    body("gambar_berita").custom(async (value, meta) => {
      const gambar_berita = meta.req.body.gambar_berita;
      if (gambar_berita.size > 0) {
        const imageType = gambar_berita.type;
        const size = gambar_berita.size / 1000000;
        const mimeType = [
          "image/jpeg",
          "image/gif",
          "image/png",
          "image/svg+xml",
        ];
        const byte = 3000000 / 1000000;
        const checkType = mimeType.includes(imageType);
        if (!checkType) {
          return Promise.reject(
            "Format file tidak didukung, format yang didukung yaitu: " +
              mimeType.join(",")
          );
        }
        if (size > byte) {
          return Promise.reject("Ukuran gambar lebih dari 3 mb ");
        }
      }
    }),
    update
  );

router.delete("/delete/:id", destroyData);
module.exports = router;

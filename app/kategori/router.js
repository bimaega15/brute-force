var express = require("express");
const { body } = require("express-validator");
const formidable = require("formidable");
var router = express.Router();

const { index, create, edit, update, destroyData } = require("./controller");

const formData = (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    req.body = fields;
    req.body.gambar_kategori = files;
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
    body("nama_kategori")
      .notEmpty()
      .withMessage("Nama kategori wajib diisi")
      .trim(),
    body("gambar_kategori").custom(async (value, meta) => {
      const gambar_kategori = meta.req.body.gambar_kategori;
      if (gambar_kategori.size > 0) {
        const imageType = gambar_kategori.type;
        const size = gambar_kategori.size / 1000000;
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
    body("nama_kategori")
      .notEmpty()
      .withMessage("Nama kategori wajib diisi")
      .trim(),
    body("gambar_kategori").custom(async (value, meta) => {
      const gambar_kategori = meta.req.body.gambar_kategori;
      if (gambar_kategori.size > 0) {
        const imageType = gambar_kategori.type;
        const size = gambar_kategori.size / 1000000;
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

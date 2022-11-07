var express = require("express");
const { body } = require("express-validator");
var router = express.Router();

const userHelper = require("../users/helper");
const { index, create } = require("./controller");

router
  .route("/")
  .post(
    body("username").notEmpty().withMessage("Username tidak boleh kosong"),
    body("password").notEmpty().withMessage("Password tidak boleh kosong"),
    index
  );

router.route("/register").post(
  body("username").notEmpty().withMessage("Username wajib diisi").trim(),
  body("username").custom(async (value, meta) => {
    let filter = {};
    filter.username = value;

    let check = await userHelper.getFindOneData(filter);
    if (check != null) {
      return Promise.reject("Username ini sudah digunakan");
    }
  }),

  body("password").custom(async (value, meta) => {
    const { confirm_password } = meta.req.body;
    if (value == null) {
      return Promise.reject("Password wajib diisi");
    }
    if (confirm_password == null) {
      return Promise.reject("Confirm Password wajib diisi");
    }

    if (value != confirm_password) {
      return Promise.reject("Password tidak sama dengan confirm password");
    }
  }),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .trim()
    .isEmail()
    .withMessage("Email tidak valid"),
  body("email").custom(async (value, meta) => {
    let filter = {};
    filter.email = value;

    let check = await userHelper.getFindOneData(filter);
    if (check != null) {
      return Promise.reject("Email ini sudah digunakan");
    }
  }),
  create
);
module.exports = router;

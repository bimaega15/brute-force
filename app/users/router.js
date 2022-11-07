var express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
var router = express.Router();

const userHelper = require("../users/helper");
const { index, create, edit, update, destroyData } = require("./controller");

router.use(protect);
router
  .route("/")
  .get(index)
  .post(
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

router
  .route("/edit/:id")
  .get(edit)
  .put(
    body("username").notEmpty().withMessage("Username wajib diisi").trim(),
    body("username").custom(async (value, meta) => {
      const { id } = meta.req.params;
      let filter = {};
      filter.username = value;

      let check = await userHelper.getFindOneData(filter, id);
      if (check != null) {
        return Promise.reject("Username ini sudah digunakan");
      }
    }),
    body("password").custom(async (value, meta) => {
      const { confirm_password } = meta.req.body;
      if (value != null && confirm_password != null) {
        if (value != confirm_password) {
          return Promise.reject("Password tidak sama dengan confirm password");
        }
      }
    }),
    body("email")
      .notEmpty()
      .withMessage("Email wajib diisi")
      .trim()
      .isEmail()
      .withMessage("Email tidak valid"),

    body("email").custom(async (value, meta) => {
      const { id } = meta.req.params;

      let filter = {};
      filter.email = value;

      let check = await userHelper.getFindOneData(filter, id);
      if (check != null) {
        return Promise.reject("Email ini sudah digunakan");
      }
    }),

    update
  );

router.delete("/delete/:id", destroyData);
module.exports = router;

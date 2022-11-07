const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { getFindOneData, insertData } = require("../users/helper");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid form validation",
        result: errors.array(),
      });
    }

    const { username, password } = req.body;
    let filter = {};
    filter.username = username;
    let checkUsername = await getFindOneData(filter);
    if (checkUsername) {
      let hash = checkUsername.password;
      let checkPassword = bcrypt.compareSync(password, hash);
      if (checkPassword) {
        let output = {};
        let data = {
          id: checkUsername.id,
          username: checkUsername.username,
          email: checkUsername.email,
        };

        // json web token
        const token = jwt.sign(
          {
            data: data,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        output.data = data;
        output.token = token;

        return res.status(200).json({
          status: 200,
          message: "Berhasil login",
          result: output,
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Password anda salah",
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "Username anda salah",
      });
    }
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

module.exports = {
  index,
  create,
};

const { request, response } = require("express");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const connect = require("../DataBase/DataBase");

const addNewUser = async (req = request, res = response) => {
  const { username, email, passwordd } = req.body;

  const salt = bcrypt.genSaltSync();
  const pass = bcrypt.hashSync(passwordd, salt);

  const conn = await connect();

  const hasEmail = await conn.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);

  if (hasEmail[0].length == 0) {
    await conn.query(`CALL SP_REGISTER_USER(?,?,?);`, [username, email, pass]);

    conn.end();

    return res.json({
      resp: true,
      message: "Usuario " + username + " fue creado con exito!",
    });
  } else {
    return res.json({
      resp: false,
      message: "Email already exists",
    });
  }
};

const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),

    httpOnly: true,
  });

  res.status(200).json({
    success: true,

    message: "Logged Out",
  });
};

const getUserById = async (req = request, res = response) => {
  try {
    const conn = await connect();

    const userdb = await conn.query(`CALL SP_GET_USER_BY_ID(?);`, [
      req.uidPerson,
    ]);

    conn.end();

    return res.json({
      resp: true,
      message: "Get user by Id",
      user: userdb[0][0][0],
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

const changeFotoProfile = async (req = request, res = response) => {
  try {
    const conn = await connect();

    const rows = await conn.query("SELECT image FROM person WHERE uid = ?", [
      req.uidPerson,
    ]);

    if (rows[0][0].image != null) {
      await fs.unlink(path.resolve("src/Uploads/Profile/" + rows[0][0].image));
    }

    await conn.query("UPDATE person SET image = ? WHERE uid = ?", [
      req.file.filename,
      req.uidPerson,
    ]);

    await conn.end();

    return res.json({
      resp: true,
      message: "Updated image",
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

const updateInformationUser = async (req = request, res = response) => {
  try {
    const { firstname, lastname, phone, address, reference } = req.body;

    const conn = await connect();

    await conn.query(`CALL SP_UPDATE_INFORMATION(?,?,?,?,?,?);`, [
      req.uidPerson,
      firstname,
      lastname,
      phone,
      address,
      reference,
    ]);

    await conn.end();

    return res.json({
      resp: true,
      message: "Infomation personal added",
    });
  } catch (err) {
    return res.json({
      resp: false,
      message: err,
    });
  }
};

const updateStreetAddress = async (req, res = response) => {
  try {
    const { address, reference } = req.body;

    const conn = await connect();

    await conn.query(`CALL SP_UPDATE_STREET(?,?,?);`, [
      req.uidPerson,
      address,
      reference,
    ]);

    await conn.end();

    return res.json({
      resp: true,
      message: "Street Address updated",
    });
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

module.exports = {
  addNewUser,
  getUserById,
  changeFotoProfile,
  updateInformationUser,
  updateStreetAddress,
  logout,
};

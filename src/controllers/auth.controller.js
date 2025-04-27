import pool from '../db.js';
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const findUser = async (email) => {
  try {
    const result = await pool.query("SELECT id, nombre, apellido, email, password_hash, fecha_registro, ultimo_login, activo FROM usuarios WHERE email = '" + email + "'");
    const res = result.rows;
    return res;
  } catch (err) {
    console.log('Error al ejecutar la consulta (findUser):', err.stack);
  }
};

const findUserName = async (firstName) => {
  try {
    const result = await pool.query("SELECT id, nombre, apellido, email, password_hash, fecha_registro, ultimo_login, activo FROM usuarios WHERE nombre = '" + firstName + "'");
    const res = result.rows;
    return res;
  } catch (err) {
    console.log('Error al ejecutar la consulta (findUserName):', err.stack);
  }
};

const findEmailDuplicate = async (email) => {
  try {
    const result = await pool.query("SELECT email FROM usuarios WHERE email = '" + email + "'");
    const res = result.rows;
    return res;
  } catch (err) {
    console.log('Error al ejecutar la consulta (findEmailDuplicate):', err.stack);
  }
}

const userOne = async (email) => {
  let userFind = {};
  let user = await findUser(email);
  if (user.length !== 0) {
    userFind.id = user[0].id;
    userFind.firstName = user[0].nombre;
    userFind.lastName = user[0].apellido;
    userFind.email = user[0].email;
    userFind.password = user[0].password_hash;
    userFind.dateRegister = user[0].fecha_registro;
    userFind.lastLogin = user[0].ultimo_login;
    userFind.active = user[0].activo;
  }
  return userFind;
};

const userOneName = async (firstName) => {
  let userFind = {};
  let user = await findUserName(firstName);
  if (user.length !== 0) {
    userFind.id = user[0].id;
    userFind.firstName = user[0].nombre;
    userFind.lastName = user[0].apellido;
    userFind.email = user[0].email;
    userFind.dateRegister = user[0].fecha_registro;
    userFind.lastLogin = user[0].ultimo_login;
    userFind.active = user[0].activo;
  }
  return userFind;
}

const userDuplicate = async (email) => {
  let emailFind = null
  let efind = await findEmailDuplicate(email)
  if (efind.length !== 0) {
    emailFind = efind[0].email;
  }
  return emailFind;
}

const insertUser = async (email, password_hash, nombre, apellido) => {
  try {
    let userFind = {};
    const now = new Date();
    const time = now.toISOString()
      .replace('T', ' ')
      .replace('Z', '')
      .slice(0, 19);
    const pass = await bcrypt.hash(password_hash, 10);
    const result = await pool.query("INSERT INTO usuarios (email, password_hash, nombre, apellido, fecha_registro, ultimo_login)"
      + "VALUES ("
      + "'" + email + "',"
      + "'" + pass + "',"
      + "'" + nombre + "',"
      + "'" + apellido + "',"
      + "'" + time + "',"
      + "'" + time + "') RETURNING *");
    if (result.rowCount > 0) {
      userFind.id = result.rows[0].id;
      userFind.firstName = result.rows[0].nombre;
      userFind.lastName = result.rows[0].apellido;
      userFind.email = result.rows[0].email;
      userFind.password = result.rows[0].password_hash;
      userFind.dateRegister = result.rows[0].fecha_registro;
      userFind.lastLogin = result.rows[0].ultimo_login;
      userFind.active = result.rows[0].activo;
      return userFind;
    } else {
      return null;
    }
  } catch (err) {
    console.log('Error al ejecutar la consulta (insertUser):', err.stack);
    return null;
  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const login = async (req, res) => {
  try {
    let userFound = null;
    const { email, password } = req.body;
    // await sleep(3000);
    userFound = await userOne(email.toLowerCase());
    
    if (userFound === null) {
      return res.status(400).json({succes: false, user: userFound, jwt: "", message: "Usuario no encontrado"});
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({succes: false, user: userFound, jwt: "", message: "Contraseña incorrecta"});
    const token = await createAccessToken({
      id: userFound.id,
      firstName: userFound.firstName
    });
    return res
      .status(200)
      .json({succes: true, user: userFound, jwt: token, message: "Inicio correcto"})
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({succes: false, user: userFound, jwt: "", message: "Error"});
  }
}

export const verifyToken = async (req, res) => {
  const { token } = req.body;
    // await sleep(3000);
  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401)
    const userFound = await userOneName(user.firstName)
    if (userFound === null) return res.status(401).json({succes: false, user: user, jwt: token, message: "No existe Token"});
    return res
      .status(200)
      .json({succes: true, user: userFound, jwt: token, message: "Inicio correcto"})
  })
}

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (firstName == "" || lastName == "" || lastName == "" || password == "") return res.sendStatus(401)
    const emailDupicate = await userDuplicate(email)
    if (emailDupicate != null) return res.sendStatus(409)
    const user = insertUser(email, password, firstName, lastName)
    if (user == null) return res.sendStatus(401)
    const token = await createAccessToken({
      id: user.id,
      firstName: user.firstName
    });
    return res
      .status(200)
      .json({succes: true, user: user, jwt: token, message: "Inicio correcto"});
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({succes: false, user: "", jwt: "", message: "Error"});
  }
}
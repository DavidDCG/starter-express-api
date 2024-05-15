const { MongoClient } = require('mongodb');
const {dataReturn} = require('../src/helpers/constants');
require('dotenv').config();

const url = process.env.DATABASE_URL;
const dbRoot = process.env.DATABASE_ROOT;
const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(url, { });
    console.log(dbRoot);
    const db = client.db(dbRoot);
    dataReturn.valid = true;
    dataReturn.message = "Conexión a la base de datos establecida";
    dataReturn.type = "success"
    dataReturn.data = { dataClient: client , dataBase: db }
  } catch (err) {
    dataReturn.valid = false;
    dataReturn.message = "Error al conectar a la base de datos " + err;
    dataReturn.type = "error"
    dataReturn.data = { err }
  }
  return dataReturn;
};

module.exports = { connectToDatabase };
const { Spanner } = require('@google-cloud/spanner');
const { dataReturn } = require('../src/helpers/constants');
require('dotenv').config();

const connectToSpanner =  (dataConnectionHalconHuman) => {
  try {
    process.env.GOOGLE_APPLICATION_CREDENTIALS =  dataConnectionHalconHuman.GOOGLE_APPLICATION_CREDENTIALS;// "./config/halconhuman-296473ce7dce.json";
    const spanner = new Spanner({
      projectId: dataConnectionHalconHuman.projectID,
    });
    const instance = spanner.instance(dataConnectionHalconHuman.instanceID);
    const database = instance.database(dataConnectionHalconHuman.databaseID);
    dataReturn.valid = true;
    dataReturn.message = "instancia Spanner establecida";
    dataReturn.type = "success";
    dataReturn.data = { dataInstance: instance, dataDatabase: database, dataSpanner : spanner };
  } catch (err) {
    dataReturn.valid = false;
    dataReturn.message = "Error al instanciar la conexíon a la base de datos " + err;
    dataReturn.type = "error";
    dataReturn.data = { err };
  }
  return dataReturn;
};

module.exports = { connectToSpanner };
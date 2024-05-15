require('dotenv').config();
const dataReturn = {
    type: null,
    valid: null,
    message: null,
    data: null
};

const dataConnectionHalconHuman = {
    projectID: process.env.PROJECT_ID,
    instanceID: process.env.INSTANCE_ID,
    databaseID: process.env.DATABASE_ID,
    GOOGLE_APPLICATION_CREDENTIALS: "./config/access/halconhuman_access.json"
};


module.exports = {
    dataReturn,
    dataConnectionHalconHuman
}
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const routesToken = require('./src/routes/token_routes');
const routesLogin = require('./src/routes/login_routes');
const routesCatalogs = require('./src/routes/catalogs_routes');
const routesTasks = require('./src/routes/training_routes');
const routesEmail = require('./src/routes/email_routes');
const { connectToDatabase } = require('./config/db');

require('dotenv').config();
const cors = require('cors');
const app = express();
const morgan = require('morgan');
app.use(cors());
// middlewares
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Configurar bodyParser para manejar las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectToDatabase().then((dataReturn) => {
  switch (dataReturn.valid) {
    case true:
      // Conectar a la base de datos
      app.use('/token', routesToken);
      app.use('/login', routesLogin);
      app.use('/catalogs', routesCatalogs);
      app.use('/training', routesTasks);
      app.use('/email', routesEmail);
      // Inicia el servidor
      const PORT = process.env.PORT; //|| 3000;
      app.listen(PORT, () => {
        console.log(`Servidor en ejecución en el puerto ${PORT}`);
        // res.status(500).json({ error: `Servidor en ejecución en el puerto ${PORT}` });
      });
    //const db = dataReturn.data.dataBase;
    //const client = dataReturn.data.dataClient;
    //return db.collection('Modulos').find({}).toArray();
    case false:
      console.error(dataReturn.message);
      break;
  }
}).catch((err) => {
  console.error("error interno del servidor." + err)
  //res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de errores no controlados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' + err.stack });
});





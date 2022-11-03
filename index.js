// importamos las variables de entorno de la app
require('dotenv').config();

// importamos express js
const express = require('express');

// importamos lor cors
const cors = require('cors');

// importamos la conexcion de la BD
const {dbConnection} = require('./database/config_db')

// Crear el servidor express
const app = express();

// configuramos cors (sirve para especificar los dominios de donde seran consumida mi app y para especificar los middlewares)
app.use(cors());

// conectar a la base de datos
dbConnection();

// Lectura y parseo del body
app.use(express.json());

// rutas
app.use('/api/user', require('./routes/user-routes'));
/*
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Hola mundo'
    });
});
*/



// levantar servidor nodejs
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})
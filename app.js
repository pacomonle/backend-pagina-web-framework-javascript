'use strict'

// Cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');
const cors = require('cors')
// Middlewares 
    //cargar bodyParser
app.use(bodyParser.urlencoded({extended:false}));
   // convertir cualquier peticion en un JSON
app.use(bodyParser.json());

// app.use(cors());
// npm i -s cors 
// CORS - para configurar el control de accesos y decir quienes pueden acceder
// allow , el * permite a todo el mundo hacer peticiones

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes);

// ruta o metodo de prueba para la API REST
app.get('/probando', (req, res)=>{
    console.log("Hola Mundo");
    // respondiendo un JSON
    return res.status(200).send({
        descripcion: 'portofolio',
        autor: 'Francisco Monleon',
        url: 'https://blog.nolitoxd.games/'
    })
    /* respondiento HTML
    return res.status(200).send(`
    <ul>
        <li>NodeJS</li> 
        <li>Mongodb</li>
        <li>React</li>
        <li>Javascript</li>
    </ul>
      
    `) */
});



// Exportar modulo (fichero actual) -> para poder usar app fuera de este archivo
module.exports = app;
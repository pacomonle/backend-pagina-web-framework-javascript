'use strict'

// cargar mongoose 
var mongoose = require('mongoose');
// cargar servidor
var app = require('./app');
// configurar puerto
var port = 3900;
// desactivar metodos antiguos de mongoose
mongoose.set('useFindAndModify', false);
// para hacer promesas
mongoose.Promise = global.Promise;
// conecta mongoose
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
        .then(() => {
            console.log('Conexión a la base de datos correcta !!!');

            // Crear servidor y ponerme a escuchar peticiones HTTP, en app tengo express (creado en app.js)
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });
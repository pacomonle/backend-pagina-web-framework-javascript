'use strict'
// cargar mongoose
var mongoose = require('mongoose');
// para utilizar los objetos de este tipo
var Schema = mongoose.Schema;

// crear propiedades del objeto
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});

// los objetos que voy a crear al exportar son 'Article' y con el esquema de ArticleSchema
module.exports = mongoose.model('Article', ArticleSchema);
// articles (mongoose guarda en mongodb el singular en plural)--> guarda documentos de este tipo y con estructura dentro de la colección

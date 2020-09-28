'use strict'
// cargar express
var express = require('express');
// cargar controlador
var ArticleController = require('../controllers/article');
// crear route de express
var router = express.Router();
// cargar el connect-multiparty para el manejo de archivos
var multipart = require('connect-multiparty');
     // donde queremos que guarde los archivos
var md_upload = multipart({ uploadDir: './upload/articles'});

// Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

// Rutas útiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;
'use strict'
// importar el validator libreria de node
var validator = require('validator');
// importar filesystem para poder borrar archivos
var fs = require('fs');
// importar path (para rutas de archivos)
var path = require('path');
// importar el modelo
var Article = require('../models/article');
// objeto controller
var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;
    
        return res.status(200).send({
            curso: 'Portofolio',
            autor: 'Francisco Monleon',
            url: 'https://blog.nolitoxd.games/',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },
    
// metodo save para guardar articulos
    save: (req, res) => {
        // 1.Recoger parametros por post
        var params = req.body;
        console.log(params)

        // 2.Validar datos (validator) - try - catch
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
       // 3.comprobar si la validacion es correcta
        if(validate_title && validate_content){
            
            //Crear el objeto a guardar utilizando la clase creada en el modelo
            var article = new Article();

            // Asignar valores obtenidos como parametros
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }
           
            // 4.Guardar el articulo
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }

                // 5.Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
      // si la validacion no es correcta
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }
       
    },

/// metodo listar todos los articulos
    getArticles: (req, res) => {
      //hacer una query con find vacio ya que quiero traer todos los articulos
        var query = Article.find({});
     // hacer query buscando los ultimos 5 articulos
        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find con sort para ordenar descendente (el menos delante)
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    },

 // Metodo para sacar un solo articulo
    getArticle: (req, res) => {

        //1. Recoger el id de la url
        var articleId = req.params.id;

        //2. Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo !!!'
            });
        }

        // 3.Buscar el articulo - findById
        Article.findById(articleId, (err, article) => {
            
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
               // status: 'success',
                article
            });

        });
    },

// metodo para editar un articulo
    update: (req, res) => {
        // 1.Recoger el id del articulo por la url
        var articleId = req.params.id;

        // 2.Recoger los datos que llegan por put
        var params = req.body;

        // 3.Validar datos try - catch
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            }); 
        }
         // 4.comprobar si la validacion es correcta
        if(validate_title && validate_content){
             // Find and update
             Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
             });
        }else{
             // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
       
    },

// metodo para eliminar/borrar articulo
    delete: (req, res) => {
        //1. Recoger el id de la url
        var articleId = req.params.id;

        // 2. Find and delete
         Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        }); 
    },

// metodo para la subida de archivos
    upload: (req, res) => {
        // Nota - Configurar el modulo connect multiparty router/article.js (hecho)

        // 1.Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';
        console.log('files', req.files)
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // 2.Conseguir nombre y la extensión del archivo - en vez de img usamo file0 para subir imagenes por post
        var file_path = req.files.file0.path;
        // trocear o separar el path y coger la ultima parte
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // 3.Nombre del archivo (tercer celemento del array) - usamos libreria path y en la posicio [2] del array nos viene el path (unico) de la imagen
        var file_name = file_split[2];

        // 4.Extensión del fichero (segundo elemento del array)
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // 4.Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // 5. Si todo es valido, sacando id de la url y actualizarlo
             var articleId = req.params.id;

             if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    }, // end upload file

// metodo para recuperar una imagen
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
     // comprobar si el archivo existe o su ruta
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file)); // librerira path
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },
// metodo para realizar busquedas
    search: (req, res) => {
        //1. Sacar el string a buscar
        var searchString = req.params.search;

        // Find or - buscar por una serie de condiciones con el operador $or de mongoose
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},   // la i es de incluido
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {       // exec para ejecutar la query

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    }

};  // end controller

// exportar el controlador
module.exports = controller;
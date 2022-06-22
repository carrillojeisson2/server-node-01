"use strict";

const validator = require("validator");
var fs = require("fs");
var path = require("path");

const Article = require("../models/article");

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;

    return res.status(200).send({
      curso: "lakjsd",
      auto: "homer",
      url: "http://homer",
      hola,
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "hola metodo prueba",
    });
  },

  save: (req, res) => {
    const params = req.body;

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      var article = new Article();

      article.title = params.title;
      article.content = params.content;

      if (params.image) {
        article.image = params.image;
      } else {
        article.image = null;
      }

      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "El articulo no se ha guardado",
          });
        }

        return res.status(200).send({
          status: "success",
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "datos no validos",
      });
    }

    // return res.status(200).send({
    //   article: params,
    // });
  },

  getArticles: (req, res) => {
    var query = Article.find({});

    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    query
      .find({})
      .sort("-_id")
      // .sort("_id")
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al devolver los articulos",
          });
        }

        if (!articles) {
          return res.status(404).send({
            status: "error",
            message: "Error no articles",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },

  getArticle: (req, res) => {
    var articleId = req.params.id;

    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "No existe el articulo",
        });
      }

      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },

  update: (req, res) => {
    var articleId = req.params.id;

    var params = req.body;

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar",
            });
          }
          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No existe el articulo",
            });
          }

          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(404).send({
        status: "error",
        message: "Error validacion",
      });
    }
  },

  delete: (req, res) => {
    var articleId = req.params.id;

    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar",
        });
      }

      if (!articleRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No se ha borrado el articulo, posiblemente no exista",
        });
      }

      return res.status(200).send({
        status: "success",
        article: articleRemoved,
      });
    });
  },

  upload: (req, res) => {
    var file_name = "imagen no subida";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    var file_name = file_split[2];

    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extension de la imagen no es valida",
        });
      });
    } else {
      var articleId = req.params.id;

      if (articleId) {
        Article.findOneAndUpdate(
          { _id: articleId },
          { image: file_name },
          { new: true },
          (err, articleUpdated) => {
            if (err || !articleUpdated) {
              return res.status(400).send({
                status: "error",
                message: "Error al guardar la imagen",
              });
            }

            return res.status(200).send({
              status: "success",
              article: articleUpdated,
            });
          }
        );
      } else {
        return res.status(200).send({
          status: "success",
          image: file_name,
        });
      }
    }
  },


//   upload: (req, res) => {
//     // Configurar el modulo connect multiparty router/article.js (hecho)

//     // Recoger el fichero de la petición
//     var file_name = 'Imagen no subida...';

//     if (!req.files) {
//         return res.status(404).send({
//             status: 'error',
//             message: file_name
//         });
//     }

//     // Conseguir nombre y la extensión del archivo
//     var file_path = req.files.file0.path;
//     var file_split = file_path.split('\\');

//     // * ADVERTENCIA * EN LINUX O MAC
//     // var file_split = file_path.split('/');

//     // Nombre del archivo
//     var file_name = file_split[2];

//     // Extensión del fichero
//     var extension_split = file_name.split('\.');
//     var file_ext = extension_split[1];

//     // Comprobar la extension, solo imagenes, si es valida borrar el fichero
//     if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

//         // borrar el archivo subido
//         fs.unlink(file_path, (err) => {
//             return res.status(200).send({
//                 status: 'error',
//                 message: 'La extensión de la imagen no es válida !!!'
//             });
//         });

//     } else {
//         // Si todo es valido, sacando id de la url
//         var articleId = req.params.id;

//         if (articleId) {
//             // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
//             Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

//                 if (err || !articleUpdated) {
//                     return res.status(200).send({
//                         status: 'error',
//                         message: 'Error al guardar la imagen de articulo !!!'
//                     });
//                 }

//                 return res.status(200).send({
//                     status: 'success',
//                     article: articleUpdated
//                 });
//             });
//         } else {
//             return res.status(200).send({
//                 status: 'success',
//                 image: file_name
//             });
//         }

//     }
// }, // end upload file


  getImage: (req, res) => {
    var file = req.params.image;
    var path_file = "./upload/articles/" + file;

    fs.exists(path_file, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(200).send({
          status: "error",
          message: "La imagen no existe",
        });
      }
    });
  },

  search: (req, res) => {
    var searchString = req.params.search;

    Article.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error en la peticion",
          });
        }

        if (!articles || articles.length <= 0) {
          return res.status(404).send({
            status: "error",
            message: "No hay articulos que coincidan con la busqueda",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },
};

module.exports = controller;

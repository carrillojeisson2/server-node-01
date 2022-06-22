"use strict";

var express = require("express");
var ArticleController = require("../controllers/article");

var router = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./upload/articles" });

// const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './upload/articles/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, "user" + Date.now() + file.originalname);
//     }
//   });

//   const upload = multer({ storage: storage });



router.post("/datos-curso", ArticleController.datosCurso);
router.get("/test-de-controller", ArticleController.test);

router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.put("/article/:id", ArticleController.update);
router.delete("/article/:id", ArticleController.delete);
router.post("/upload-image/:id", md_upload, ArticleController.upload);
// router.post("/upload-image/:id?",upload.single('file0'), ArticleController.upload);

router.get("/get-image/:image", ArticleController.getImage);
router.get("/search/:search", ArticleController.search);
module.exports = router;

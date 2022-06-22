"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { _applyPlugins } = require("mongoose");
const cors = require("cors");

var app = express();

var article_routes = require("./routes/article");

// var corsOptions = {
//   origin: "http://localhost:3000",
// };
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/api", article_routes);

// app.get("/test", function (req, res) {
//   return res.status(200).send({});
// });

module.exports = app;

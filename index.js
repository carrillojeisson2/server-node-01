"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/blog", { useNewUrlParser: true })
  .then(() => {
    console.log("db ok");

    app.listen(port, () => {
      console.log("server corriendo en http://localhost:" + port);
    });
  });

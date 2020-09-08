var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  name: String,
  owner: String,
  html: String,
  css: String,
  js: String
});

module.exports = mongoose.model("Project", projectSchema);

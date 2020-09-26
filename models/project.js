var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  // project name
  name: String,
  //projct owner id
  owner: String,
  // html data 
  html: String,
  // css data 
  css: String,
  // js data 
  js: String
});

module.exports = mongoose.model("Project", projectSchema);

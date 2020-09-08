var express = require('express');
var router = express.Router();

router.get('/createProject/:name', function(req, res) {
  var user = req.user;
  var name = req.params.name;
  if(user) {
    var newProject = new Project({
      owner: user._id,
      name: name,
    });
  }else {
    var newProject = new Project();
  }

  newProject.save(function( err, data) {
    if (err) {
      console.log(err);
      res.render('error');
    } else {
      res.redirect('/project/' + data._id);
    }
  })
});

router.get('/project/:id', function(req, res) {
  if (req.params.id) {
    Project.findOne({_id: req.params.id}, function(err, data) {
      if (err) {
        console.log(err);
        res.render('error');
      }

      if (data) {
        res.render('project', {html: data.html,css: data.css,js: data.js ,pName: data.name, roomId: data.id, user: req.user});
      } else {
        res.render('error');
      }
    })
  } else {
    res.render('error');
  }
});

module.exports = router;

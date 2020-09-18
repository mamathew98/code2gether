var express = require("express");
var router = express.Router();

const { body, validationResult } = require("express-validator");

var nodeMailer = require("nodemailer");
var config = require("../config");
var transporter = nodeMailer.createTransport(config.mailer);

/* GET home page. */
router.get("/", function (req, res, next) {
  var user = req.user;
  if(user){
    var userProjects;
    Project.find({owner: user._id} , function(err, projects) {
      userProjects = projects;
      res.render("index", { title: "Code2Gether", projects: userProjects });
    });
  }else {
    res.render("index", { title: "Code2Gether", projects: userProjects });
  }
});

router.get("/about", function (req, res, next) {
  res.render("about", { title: "Code2Gether" });
});

router
  .route("/contact")
  .get(function (req, res, next) {
    res.render("contact", {
      title: "Code2Gether",
    });
  })
  .post(
    [
      // name can't be empty
      body("name").isLength({ min: 1 }).withMessage("Name Empty."),
      // username must be an email
      body("email").isEmail().withMessage("Email Invalid."),
      // message must be at least 1 chars long
      body("message").isLength({ min: 1 }).withMessage("Message Empty."),
    ],
    function (req, res, next) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render("contact", {
          title: "Code2Gether",
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          errorMessages: errors.errors,
        });
      } else {
        var mailOPtions = {
          from: "Code2Gether <no-reply@code2gether.platform.com>",
          to: "code2gether.platform@gmail.com",
          subject: "You Got a New message from a Visitor 👨🏼‍💻 👩🏼‍💻",
          text: req.body.message,
        };

        transporter.sendMail(mailOPtions, function (err, info) {
          if (err) {
            return console.log(err);
          }
          res.render("thank", {
            title: "Code2Gether",
          });
        });
      }
    }
  );


module.exports = router;

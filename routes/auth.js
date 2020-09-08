var express = require("express");
var router = express.Router();
var passport = require("passport");

const { body, validationResult } = require("express-validator");

router
  .route("/login")
  .get(function (req, res, next) {
    res.render("login", { title: "Login" });
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      res.redirect("/");
    }
  );

router
  .route("/register")
  .get(function (req, res, next) {
    res.render("register", { title: "register" });
  })
  .post(
    [
      // name can't be empty
      body("name").isLength({ min: 1 }).withMessage("Name Empty."),
      // username must be an email
      body("email").isEmail().withMessage("Email Invalid."),

      body("password").isLength({ min: 4 }).withMessage("Invalid Password."),

      body("confirmPassword")
        .custom(async (confirmPassword, { req }) => {
          const password = req.body.password;

          // If password and confirm password not same
          // don't allow to sign up and throw error
          if (password !== confirmPassword) {
            throw new Error("Passwords Do Not Match");
          }
        })
        .isLength({ min: 4 })
        .withMessage("Passwords Do Not Match."),
    ],
    function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("register", {
          name: req.body.name,
          email: req.body.email,
          errorMessages: errors.errors,
        });
      } else {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.save(function (err) {
          if (err) {
            res.render("register", {
              errorMessages: err,
            });
          } else {
            res.redirect("/login");
          }
        });
      }
    }
  );

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const isAuth = require("../middleware/is-auth");
const User = require("../models/user");
const { body } = require("express-validator");

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter Valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Email Already Exist");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please Enter Valid Password & Minimal 5 Character")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password Not Match !");
        }
        return true;
      })
  ],
  authController.postSignup
);

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email.")
      .normalizeEmail(),
    body("password", "Please enter password at least 5 characters.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post("/logout", isAuth, authController.postLogout);

module.exports = router;

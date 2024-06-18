import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import bcrypt from "bcryptjs";

const signUp = [
  body("firstName")
    .trim()
    .isLength({ min: 1 }).withMessage("First name must not be empty.")
    .isLength({ max: 100 }).withMessage("First name must not exceed 100 characters.")
    .escape(),
  body("lastName")
    .trim()
    .isLength({ min: 1 }).withMessage("Last name must not be empty.")
    .isLength({ max: 100 }).withMessage("Last name must not exceed 100 characters.")
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 1 }).withMessage("Username must not be empty.")
    .isLength({ max: 100 }).withMessage("Username must not exceed 100 characters.")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) throw new Error("Sorry, this username is taken!");
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 }).withMessage("Password must not be empty.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[a-z]).+$/).withMessage("Password must have at least one lowercase character.")
    .matches(/^(?=.*[A-Z]).+$/).withMessage("Password must have at least one uppercase character.")
    .matches(/^(?=.*[0-9]).+$/).withMessage("Password must contain at least one digit.")
    .matches(/^(?=.*?[#?!@$%^&*-]).+$/).withMessage("Password must contain at least one special character.")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) throw new Error("Passwords do not match.");
      return true;
    })
    .escape(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match.");
      return true;
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array().filter(error => error.path === "password" || error.path === "confirmPassword").length > 0) {
      res.render("sign-up-form", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        errors: errors.array(),
      })
      return;
    }
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        errors: errors.array(),
      })
      return;
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        status: "user",
      });
      await user.save();
      res.redirect("/login")
    });
  }),
];

const login = [
  body("username")
    .trim()
    .isLength({ min: 1 }).withMessage("Username must not be empty.")
    .isLength({ max: 100 }).withMessage("Username must not exceed 100 characters.")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value }).exec();
      if (value && !existingUser) throw new Error("User not found.")
    })
    .escape(),
  body("password")
    .isLength({ min: 1 }).withMessage("Password must not be empty.")
    .custom(async(value, { req }) => {
      const existingUser = await User.findOne({ username: req.body.username }).exec();
      if (value && existingUser) {
        const match = await bcrypt.compare(value, existingUser.password);
        if (!match) throw new Error("Incorrect username or password.")
      }
    })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login-form", {
        username: req.body.username,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    }
    next();
  }),

  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
];

const adminSignUp = [
  body("firstName")
  .trim()
  .isLength({ min: 1 }).withMessage("First name must not be empty.")
  .isLength({ max: 100 }).withMessage("First name must not exceed 100 characters.")
  .escape(),
  body("lastName")
    .trim()
    .isLength({ min: 1 }).withMessage("Last name must not be empty.")
    .isLength({ max: 100 }).withMessage("Last name must not exceed 100 characters.")
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 1 }).withMessage("Username must not be empty.")
    .isLength({ max: 100 }).withMessage("Username must not exceed 100 characters.")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value }).exec();
      if (existingUser) throw new Error("Sorry, this username is taken!");
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 }).withMessage("Password must not be empty.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[a-z]).+$/).withMessage("Password must have at least one lowercase character.")
    .matches(/^(?=.*[A-Z]).+$/).withMessage("Password must have at least one uppercase character.")
    .matches(/^(?=.*[0-9]).+$/).withMessage("Password must contain at least one digit.")
    .matches(/^(?=.*?[#?!@$%^&*-]).+$/).withMessage("Password must contain at least one special character.")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) throw new Error("Passwords do not match.");
      return true;
    })
    .escape(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match.");
      return true;
    })
    .escape(),
  body("passcode")
    .custom((value) => {
      if (value !== process.env.ADMIN_PASSCODE) throw new Error("Passcode is incorrect.");
      return true;
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array().filter(error => error.path === "password" || error.path === "confirmPassword").length > 0) {
      res.render("admin-sign-up-form", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        errors: errors.array(),
      });
      return;
    }
    if (!errors.isEmpty()) {
      res.render("admin-sign-up-form", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        errors: errors.array(),
      });
      return;
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        status: "admin",
      });
      await user.save();
      res.redirect("/login")
    });
  }),
];

export { signUp, login, adminSignUp }
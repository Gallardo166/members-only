import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";

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
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 }).withMessage("Password must not be empty.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/^(?=.*[a-z]).+$/).withMessage("Password must have at least one lowercase character.")
    .matches(/^(?=.*[A-Z]).+$/).withMessage("Password must have at least one uppercase character.")
    .matches(/^(?=.*[0-9]).+$/).withMessage("Password must contain at least one digit.")
    .matches(/^(?=.*?[#?!@$%^&*-]).+$/).withMessage("Password must contain at least one special character.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      status: "user",
    });
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        errors: errors.array(),
      })
      return;
    }

    await user.save();
    next();
  }),

  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/user"
  }),
];

export { signUp }
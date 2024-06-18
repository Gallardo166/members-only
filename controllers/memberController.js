import Message from "../models/message.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const createMessage = [
  body("title")
    .trim()
    .isLength({ min: 1 }).withMessage("Title must not be empty.")
    .isLength({ max: 100 }).withMessage("Title must not exceed 100 characters.")
    .escape(),
  body("body")
    .trim()
    .isLength({ min: 1 }).withMessage("Body text must not be empty.")
    .isLength({ max: 500 }).withMessage("Body text must not exceed 500 characters.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("create-message-form", {
        title: req.body.title,
        body: req.body.body,
        errors: errors.array(),
      });
    }
    const message = await Message({
      title: req.body.title,
      body: req.body.body,
      user: req.user._id,
      date: Date.now(),
    });
    await message.save();
    res.redirect("/member");
  }),
]

export { createMessage }

import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";

const becomeMember = [
  body("passcode")
    .custom((value) => {
      if (value !== process.env.PASSCODE) throw new Error("Wrong passcode.");
      return true;
    })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("become-member", {
        errors: errors.array(),
      });
    }
    await User.updateOne( { _id: req.user._id }, { $set: { status: "member" } });
    res.redirect("/member");
  }),
];

export { becomeMember };
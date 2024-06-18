import express from "express";
import Message from "../models/message.js";
import { signUp, login } from "../controllers/guestController.js";

const router = express.Router();

router.get("/", async function(req, res, next) {
  if (req.user && req.user.status === "user") {
    res.redirect("/user");
    return;
  }
  if (req.user && req.user.status === "member") {
    res.redirect("/member");
    return;
  }
  res.render("index", {
    messages: await Message.find({}).exec(),
  });
});

router.get("/sign-up", function(req, res, next) {
  res.render("sign-up-form");
});

router.post("/sign-up", signUp);

router.get("/login", function(req, res, next) {
  res.render("login-form");
});

router.post("/login", login);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    return next(err);
  });
  res.redirect("/");
});

export default router;

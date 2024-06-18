import express from "express";
import Message from "../models/message.js";
import { signUp, login, adminSignUp } from "../controllers/guestController.js";

const router = express.Router();

router.get("/", async function(req, res, next) {
  if (req.isAuthenticated() && req.user.status === "user") {
    res.redirect("/user");
    return;
  }
  if (req.isAuthenticated() && req.user.status === "member") {
    res.redirect("/member");
    return;
  }
  if (req.isAuthenticated() && req.user.status === "admin") {
    res.redirect("/admin");
    return;
  }
  res.render("index", {
    messages: await Message.find({}).sort({ date: -1 }).exec(),
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
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/admin-sign-up", (req, res, next) => {
  res.render("admin-sign-up-form");
});

router.post("/admin-sign-up", adminSignUp);

export default router;

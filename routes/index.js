import express from "express";
import { signUp, login } from "../controllers/guestController.js";

const router = express.Router();

router.get("/", function(req, res, next) {
  if (req.user && req.user.status === "user") res.redirect("/user");
  if (req.user && req.user.status === "member") res.redirect("/member");
  res.render("index");
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

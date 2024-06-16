import express from "express";
import { signUp, login } from "../controllers/guestController.js";

const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/sign-up", function(req, res, next) {
  res.render("sign-up-form", {
    firstName: "",
    lastName: "",
    username: "",
    errors: false,
  });
});

router.post("/sign-up", signUp);

router.get("/login", function(req, res, next) {
  res.render("login-form", {
    firstName: "",
    lastName: "",
    username: "",
    errors: false,
  });
});

router.post("/login", login)

export default router;

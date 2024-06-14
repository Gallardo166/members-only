import express from "express";
import { signUp } from "../controllers/guestController.js";

const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/sign-up", function(req, res, next) {
  res.render("sign-up-form");
});

router.post("/sign-up", signUp);

export default router;

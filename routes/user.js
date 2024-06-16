import express from "express";
import { isAuth } from "./auth.js";
const router = express.Router();

router.get("/", isAuth, function(req, res, next) {
  res.render("user", { user: req.user });
});

export default router;

import express from "express";
import { isMember } from "./auth.js";
const router = express.Router();

router.get("/", isMember, function(req, res, next) {
  res.render("member", {
    user: req.user,
    userStatus: "member",
  });
});

export default router;

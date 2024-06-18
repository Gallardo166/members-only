import express from "express";
import Message from "../models/message.js";
import { isMember } from "./auth.js";
import { createMessage } from "../controllers/memberController.js";
const router = express.Router();

router.get("/", isMember, async function(req, res, next) {
  res.render("member", {
    user: req.user,
    userStatus: "member",
    messages: await Message.find({}).sort({ date: -1 }).populate("user").exec(),
  });
});

router.get("/create-message", function(req, res, next) {
  res.render("create-message-form", {
    userStatus: "member",
  });
});

router.post("/create-message", createMessage)

export default router;

import express from "express";
import Message from "../models/message.js";
import { isUser } from "./auth.js";
import { becomeMember, createMessage } from "../controllers/userController.js";
const router = express.Router();

router.get("/", isUser, async function(req, res, next) {
  res.render("user", { 
    user: req.user,
    userStatus: "user",
    messages: await Message.find({}).exec(),
  });
});

router.get("/become-member", isUser, function(req, res, next) {
  res.render("become-member", {
    userStatus: "user",
  });
});

router.post("/become-member", becomeMember);

router.get("/create-message", isUser, function(req, res, next) {
  res.render("create-message-form", {
    userStatus: "user",
  });
});

router.post("/create-message", createMessage)

export default router;

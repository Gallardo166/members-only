import express from "express";
import Message from "../models/message.js";
import { isAdmin } from "./auth.js";
import { createMessage, deleteMessage } from "../controllers/adminController.js";
const router = express.Router();

router.get("/", isAdmin, async function (req, res, next) {
  res.render("admin", {
    user: req.user,
    userStatus: "admin",
    messages: await Message.find({}).populate("user").exec(),
  });
});

router.get("/create-message", isAdmin, async function (req, res, next) {
  res.render("create-message-form", {
    userStatus: "admin",
  });
});

router.post("/create-message", createMessage);

router.get("/:id/delete-message", isAdmin, async function (req, res, next) {
  res.render("delete-message", {
    userStatus: "admin",
  });
});

router.post("/:id/delete-message", deleteMessage)

export default router;

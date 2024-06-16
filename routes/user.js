import express from "express";
import { isUser } from "./auth.js";
import { becomeMember } from "../controllers/userController.js";
const router = express.Router();

router.get("/", isUser, function(req, res, next) {
  res.render("user", { 
    user: req.user,
    userStatus: "user",
  });
});

router.get("/become-member", isUser, function(req, res, next) {
  res.render("become-member");
});

router.post("/become-member", becomeMember);

export default router;

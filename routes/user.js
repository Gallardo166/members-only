import express from "express";
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("user", { user: req.user });
});

export default router;

import createHttpError from "http-errors";
import express from "express";
import session from "express-session";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import passportConfig from "./config/passport.js";

import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import memberRouter from "./routes/member.js";
import adminRouter from "./routes/admin.js";

import "dotenv/config";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const mongoDB = process.env.MONGODB_URI;
const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: "sessions" });

mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
  }
}));

passportConfig(passport);
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
})

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/member", memberRouter);
app.use("/admin", adminRouter);

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

export default app;
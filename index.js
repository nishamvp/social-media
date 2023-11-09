import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import User from "./models/authModel.js";
import Post from "./models/postModel.js";

import { users } from "./data/index.js";
import { posts } from "./data/index.js";

import verifyToken from "./middleware/auth.js";

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENVIRONMENT VARIABLES

dotenv.config();

// MIDDLEWARES

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(morgan("common"));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", upload.single("picture"), verifyToken, createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

// ADD DATA ONE TIME
// User.insertMany(users)
// Post.insertMany(posts)

// MONGODB

const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

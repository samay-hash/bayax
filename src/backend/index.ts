import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.router";
import { lessonRouter } from "./routes/lesson.router";
import { ideaRouter } from "./routes/idea.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lesson", lessonRouter);
app.use("/api/v1/idea", ideaRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "running", timestamp: new Date().toISOString() });
});

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();

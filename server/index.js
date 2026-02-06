// Polyfill for Node versions where SlowBuffer may be missing (fixes buffer-equal-constant-time crash)
const bufferModule = require("buffer");
if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.router");
const { lessonRouter } = require("./routes/lesson.router");
const { ideaRouter } = require("./routes/idea.router");

const app = express();
const port = process.env.PORT || 3004;

const corsOptions = {
  origin: "*", // Temporarily allow all for debugging
  credentials: true, // Be careful: with origin *, credentials might not work in some browsers, but let's try wildcard first or specific regex
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Dynamic allowed list
    const allowedOrigins = [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL, // Deployed Frontend from Env
      "https://go-simon-study.vercel.app" // Hardcoded Fallback for safety
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // console.log("Blocked by CORS:", origin); // Optional logging
      callback(null, true); // TEMPORARY: Allow all to fix the issue, then restrict later
    }
  },
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lesson", lessonRouter);
app.use("/api/v1/idea", ideaRouter);

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`app connected to mongoDb database`);
    return true;
  } catch (error) {
    console.log(`error while connecting to MongoDb url : ${error.message}`);
    return false;
  }
};

const startServer = async () => {
  const connected = await main();
  if (!connected) {
    console.error("Failed to connect to MongoDB. Server will not start.");
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`the app is running at http://localhost:${port}`);
  });
};

startServer();

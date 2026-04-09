"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_router_1 = require("./routes/user.router");
const lesson_router_1 = require("./routes/lesson.router");
const idea_router_1 = require("./routes/idea.router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/user", user_router_1.userRouter);
app.use("/api/v1/lesson", lesson_router_1.lessonRouter);
app.use("/api/v1/idea", idea_router_1.ideaRouter);
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "running", timestamp: new Date().toISOString() });
});
const startServer = async () => {
    // IMPORTANT: Bind port FIRST so Render's port scanner detects it
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully!");
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
};
startServer();

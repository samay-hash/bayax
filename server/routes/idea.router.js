const express = require("express");
const {
    analyzeIdea,
} = require("../controller/idea.controller");

const ideaRouter = express.Router();

ideaRouter.post("/analyze", analyzeIdea);

module.exports = { ideaRouter };

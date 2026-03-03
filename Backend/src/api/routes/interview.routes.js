const express = require("express");
const { authUser } = require("../../middlewares/auth.middlewares");
const upload = require("../../middlewares/file.middleware");
const { generateInterviewReportController, getInterviewReportByIdController, getAllinterviewReportsController, generateResumepdfController } = require("../../controllers/interview.controller");
const { generateResumepdf } = require("../../services/ai.service");

const interviewRouter = express.Router();

interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController);
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController);
interviewRouter.get("/", authUser, getAllinterviewReportsController);
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumepdfController)

module.exports = interviewRouter;

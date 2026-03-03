const express = require("express");
const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumepdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interview_report.model");

async function generateInterviewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAI = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAI,
  });
  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

async function getAllinterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports
    })
}

async function generateResumepdfController(req, res) {
  const {interviewReportId} = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }
  const pdfBuffer = await generateResumepdf(
    interviewReport.resume,
    interviewReport.selfDescription,
    interviewReport.jobDescription
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=interview_report_${interviewReportId}.pdf`
  );
  res.send(pdfBuffer);

}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllinterviewReportsController,
  generateResumepdfController
};

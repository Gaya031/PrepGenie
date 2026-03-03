const express = require('express');
const authRouter = require("./routes/auth.routes");
const interviewRouter = require('./routes/interview.routes');
const router = express.Router();

router.use("/auth", authRouter);
router.use("/interview", interviewRouter);
module.exports = router;
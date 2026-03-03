const express = require('express');
const router = require('./api/api_v1');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get("/health-check", (req, res) => {
    res.send("server is healty");
})

app.use("/api", router);


module.exports = app;
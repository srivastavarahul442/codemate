const express = require('express');

const requestRouter = express.Router();

requestRouter.post("/request", async (req, res) => {
    res.status(200).json({ message: "Request sent successfully" });
});

module.exports = requestRouter;
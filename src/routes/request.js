const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status : " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exist!!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).json({
        message: `${req.user.firstName} sent connection Request to ${toUser.firstName}`,
        data: connectionRequest,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating Request", error: err.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!!!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connaction request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({
        message: `${loggedInUser.firstName} ${status} the connection rqquest`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  },
);

module.exports = requestRouter;

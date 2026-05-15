const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 7070;

app.use(express.json());

app.post("/user", async (req, res) => {
  try {
    const details = req.body;
    const user = new User(details);

    await user.save();

    res.status(201).json({ message: "User creataed successfully", data: user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.use("/", (req, res) => {
  res.send("Hello from /");
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
      console.log("Server is running on port no. 7070");
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });

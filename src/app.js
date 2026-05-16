const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 7070;

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

app.post("/signup", async (req, res) => {
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ message: "Users fatched successfully", data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.patch("/updateUser/:id", async (req, res) => {
  try{
    const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.send("User not found");
  }
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ message: "User updated successfully", data: updatedUser });
  }
  catch(err){
    res.status(400).send("somthing went wrong"+err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted successfully");
  } catch (err) {
    res.status(400).send("somthing went wrong");
  }
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

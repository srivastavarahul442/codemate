const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")
const app = express();
const port = 7070;

app.use(express.json());
app.use(cookieParser());

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("email And Password Required");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credential");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      let token = await jwt.sign({ _id: user._id }, "Rahul@123");
      console.log(token);
      res.cookie("token", token);
      res.send("login successfull");
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ message: "fatched User details", data: user });
  } catch (err) {
    res.status(500).json({ message: "Error : ", error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10, { id: "Rahul" });
    console.log(passwordHash);

    validateSignUpData(req);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
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
  try {
    const data = req.body;
    const { id } = req.params;

    const allowedUpdates = ["photoUrl", "skills", "about", "gender", "age"];

    const isAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k),
    );

    if (!isAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("Skills can't be more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
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

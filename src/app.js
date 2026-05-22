const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const app = express();
const port = 7070;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter);
app.use("/",userRouter);


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

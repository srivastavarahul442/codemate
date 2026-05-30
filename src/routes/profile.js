const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: "Error : ", error: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}'s Profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const isPasswordValid = await loggedInUser.validatePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Old password is not correct.");
    }

    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Password is weak!!! ")
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();
    res.status(200).json({
      message: `Password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).json("Error : " + err.message);
  }
});

// profileRouter.patch("/updateUser/:id", async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;

//     const allowedUpdates = ["photoUrl", "skills", "about", "gender", "age"];

//     const isAllowed = Object.keys(data).every((k) =>
//       allowedUpdates.includes(k),
//     );

//     if (!isAllowed) {
//       throw new Error("Update not allowed");
//     }

//     if (data?.skills?.length > 10) {
//       throw new Error("Skills can't be more than 10");
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, data, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.json({
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (err) {
//     res.status(400).send("Something went wrong: " + err.message);
//   }
// });

module.exports = profileRouter;

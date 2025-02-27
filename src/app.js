const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "pallawi",
    lastName: "sharma",
    email: "pallawi@sharma.com",
    password: "pallawi@123",
  });
  try {
    await user.save();
    res.send("user created successfully!!");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected.");
    app.listen(3000, () => {
      console.log("server started successfully at 3000");
    });
  })
  .catch((err) => {
    console.error("Database not connected!!");
  });

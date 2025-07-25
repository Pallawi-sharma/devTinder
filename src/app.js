const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validationSignup } = require("./utils/validation.js");
const cookiesParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookiesParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    validationSignup(req);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("user created successfully!!");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "Pallawi@123");
      res.cookie("token", token);
      res.send("Login successfully");
    } else {
      throw new Error("Invalid password");
    }
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token){
      throw new Error("Invalid token");
    }
    const decodedMessage = jwt.verify(token, "Pallawi@123");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
       throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const users = await User.find({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something wents wrong!!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something wents wrong!!");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!!");
  } catch (error) {
    res.status(400).send("Something wents wrong!!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("user updated successfully!!");
  } catch (error) {
    res.status(400).send("User not updated " + error.message);
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

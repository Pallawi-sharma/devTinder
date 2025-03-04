const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  
  try {
    await user.save();
    res.send("user created successfully!!");
  } catch (error) {
    res.status(400).send("Error saving the user:" + error.message);
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

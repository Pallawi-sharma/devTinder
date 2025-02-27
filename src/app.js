const express = require("express");

const app = express();

app.use("/test",(req, res) => {
  res.send("Hello from server");
});

// app.get("/user", (req,res) => {
//   res.send("get user");
// });
// app.post("/user", (req,res) => {
//   res.send("post user"); 
// })

app.get("/user", (req, res, next) => {
  // res.send("1st route handler");
  next();
},
(req, res, next) => {
  res.send("2nd route handler")
})

app.listen(3000, () => {
  console.log("server started successfully at 3000");
});

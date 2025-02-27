const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pallawisharma:xrsit1YxWiKT0eUI@namastenode.rwq79.mongodb.net/devTinder"
  );
};

module.exports = connectDB;


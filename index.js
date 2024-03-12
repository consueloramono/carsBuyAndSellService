const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("DB ERROR", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

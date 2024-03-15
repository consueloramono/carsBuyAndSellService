const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const router = require("./routers.js");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("DB ERROR", err));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

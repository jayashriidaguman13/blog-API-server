const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-api-self-gamma.vercel.app"
];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
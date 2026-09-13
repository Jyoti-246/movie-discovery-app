const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const movieRoutes = require("./routes/movieRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

console.log("OMDb key loaded:", !!process.env.OMDB_API_KEY);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Movie Discovery API is running",
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
  });
});

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

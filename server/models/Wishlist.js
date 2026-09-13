const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    imdbID: {
      type: String,
      required: true,
      unique: true,
    },

    Title: {
      type: String,
      required: true,
    },

    Year: {
      type: String,
    },

    Poster: {
      type: String,
    },

    Type: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);

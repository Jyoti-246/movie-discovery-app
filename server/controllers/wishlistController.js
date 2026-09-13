const Wishlist = require("../models/Wishlist");

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find().sort({
      createdAt: -1,
    });

    res.json({
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error.message);

    res.status(500).json({
      message: "Failed to get wishlist",
    });
  }
};

// Add movie
const addToWishlist = async (req, res) => {
  try {
    const { imdbID, Title, Year, Poster, Type } = req.body;

    if (!imdbID || !Title) {
      return res.status(400).json({
        message: "Movie information is incomplete",
      });
    }

    const existingMovie = await Wishlist.findOne({
      imdbID,
    });

    if (existingMovie) {
      return res.status(409).json({
        message: "Movie already exists in wishlist",
      });
    }

    const movie = await Wishlist.create({
      imdbID,
      Title,
      Year,
      Poster,
      Type,
    });

    res.status(201).json({
      message: "Movie added to wishlist",
      movie,
    });
  } catch (error) {
    console.error("Add wishlist error:", error.message);

    res.status(500).json({
      message: "Failed to add movie to wishlist",
    });
  }
};

// Remove movie
const removeFromWishlist = async (req, res) => {
  try {
    const { imdbID } = req.params;

    const movie = await Wishlist.findOneAndDelete({
      imdbID,
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found in wishlist",
      });
    }

    res.json({
      message: "Movie removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error.message);

    res.status(500).json({
      message: "Failed to remove movie from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

const express = require("express");

const {
  searchMovies,
  getMovieDetails,
  getDiscoveryMovies,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/search", searchMovies);

router.get("/discover", getDiscoveryMovies);

router.get("/:imdbId", getMovieDetails);

module.exports = router;

const movieService = require("../services/movieService");

const handleMovieServiceError = (error, res, defaultMessage) => {
  console.error(defaultMessage, error.message);

  // Request took too long
  if (error.code === "ECONNABORTED") {
    return res.status(504).json({
      message: "Movie service took too long to respond",
    });
  }

  // OMDb/API server returned an HTTP error
  if (error.response) {
    return res.status(502).json({
      message: "Movie service is currently unavailable",
    });
  }

  return res.status(500).json({
    message: defaultMessage,
  });
};

// Search movies
const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const page = Number(req.query.page) || 1;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data = await movieService.searchMovies(query.trim(), page);

    if (data.Response === "False") {
      if (data.Error === "Request limit reached!") {
        return res.status(429).json({
          message: "Movie API request limit reached. Please try again later.",
          movies: [],
          totalResults: 0,
          page,
        });
      }

      return res.status(404).json({
        message: data.Error || "No movies found",
        movies: [],
        totalResults: 0,
        page,
      });
    }

    res.json({
      movies: data.Search || [],
      totalResults: Number(data.totalResults) || 0,
      page,
    });
  } catch (error) {
    console.error("Search movies error:", error.message);

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Movie service took too long to respond",
      });
    }

    if (error.response) {
      return res.status(502).json({
        message: "Movie service is currently unavailable",
      });
    }

    return res.status(500).json({
      message: "Failed to search movies",
    });
  }
};

// Get movie details
const getMovieDetails = async (req, res) => {
  try {
    const { imdbId } = req.params;

    if (!imdbId) {
      return res.status(400).json({
        message: "IMDb ID is required",
      });
    }

    const movie = await movieService.getMovieDetails(imdbId);

    if (movie.Response === "False") {
      if (movie.Error === "Request limit reached!") {
        return res.status(429).json({
          message: "Movie API request limit reached. Please try again later.",
        });
      }

      return res.status(404).json({
        message: movie.Error || "Movie not found",
      });
    }

    res.json(movie);
  } catch (error) {
    console.error("Movie details error:", error.message);

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Movie service took too long to respond",
      });
    }

    if (error.response) {
      return res.status(502).json({
        message: "Movie service is currently unavailable",
      });
    }

    return res.status(500).json({
      message: "Failed to get movie details",
    });
  }
};

// Get discovery movies
const getDiscoveryMovies = async (req, res) => {
  try {
    const query = req.query.query || "avengers";

    const data = await movieService.getDiscoveryMovies(query);

    if (data.Response === "False") {
      if (data.Error === "Request limit reached!") {
        return res.status(429).json({
          message: "Movie API request limit reached. Please try again later.",
          movies: [],
        });
      }

      return res.status(404).json({
        message: data.Error || "No movies found",
        movies: [],
      });
    }

    res.json({
      movies: data.Search || [],
      totalResults: Number(data.totalResults) || 0,
    });
  } catch (error) {
    console.error("Discovery movies error:", error.message);

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Movie service took too long to respond",
      });
    }

    if (error.response) {
      return res.status(502).json({
        message: "Movie service is currently unavailable",
      });
    }

    return res.status(500).json({
      message: "Failed to load discovery movies",
    });
  }
};

module.exports = {
  searchMovies,
  getMovieDetails,
  getDiscoveryMovies,
  handleMovieServiceError,
};

const axios = require("axios");

const omdbApi = axios.create({
  baseURL: "https://www.omdbapi.com/",
  timeout: 8000,
  params: {
    apikey: process.env.OMDB_API_KEY,
  },
});

// Search movies
const searchMovies = async (query, page = 1) => {
  const response = await omdbApi.get("/", {
    params: {
      s: query,
      type: "movie",
      page,
    },
  });

  return response.data;
};

// Get movie details
const getMovieDetails = async (imdbId) => {
  const response = await omdbApi.get("/", {
    params: {
      i: imdbId,
      plot: "full",
    },
  });

  return response.data;
};

// Discovery movies
const getDiscoveryMovies = async (query) => {
  const response = await omdbApi.get("/", {
    params: {
      s: query,
      type: "movie",
      page: 1,
    },
  });

  return response.data;
};

module.exports = {
  searchMovies,
  getMovieDetails,
  getDiscoveryMovies,
};

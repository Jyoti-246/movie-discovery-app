import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const searchMovies = async (query, page = 1, signal) => {
  const response = await API.get("/movies/search", {
    params: {
      query,
      page,
    },
    signal,
  });

  return response.data;
};

export const getMovieDetails = async (imdbId, signal) => {
  const response = await API.get(`/movies/${imdbId}`, {
    signal,
  });

  return response.data;
};

export const getDiscoveryMovies = async (query, signal) => {
  const response = await API.get("/movies/discover", {
    params: {
      query,
    },
    signal,
  });

  return response.data;
};

export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (movie) => {
  const response = await API.post("/wishlist", movie);
  return response.data;
};

export const removeFromWishlist = async (imdbID) => {
  const response = await API.delete(`/wishlist/${imdbID}`);
  return response.data;
};

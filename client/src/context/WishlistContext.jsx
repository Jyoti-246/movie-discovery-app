import { createContext, useContext, useEffect, useState } from "react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../services/movieApi";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState([]);
  const [error, setError] = useState("");

  // Load wishlist from MongoDB
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWishlist();

        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error.message);

        setError(error.response?.data?.message || "Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const isInWishlist = (imdbID) => {
    return wishlist.some((movie) => movie.imdbID === imdbID);
  };

  const isUpdating = (imdbID) => {
    return updatingIds.includes(imdbID);
  };

  const toggleWishlist = async (movie) => {
    const imdbID = movie.imdbID;

    // Prevent duplicate requests
    if (isUpdating(imdbID)) {
      return;
    }

    const saved = isInWishlist(imdbID);

    try {
      setError("");

      // Mark this movie as updating
      setUpdatingIds((currentIds) => [...currentIds, imdbID]);

      if (saved) {
        // Remove from MongoDB
        await removeFromWishlist(imdbID);

        // Update frontend state
        setWishlist((currentWishlist) =>
          currentWishlist.filter((item) => item.imdbID !== imdbID),
        );
      } else {
        // Add to MongoDB
        const data = await addToWishlist(movie);

        // Update frontend state
        setWishlist((currentWishlist) => [...currentWishlist, data.movie]);
      }
    } catch (error) {
      console.error("Wishlist update failed:", error.message);

      setError(error.response?.data?.message || "Failed to update wishlist");
    } finally {
      // Remove movie from updating list
      setUpdatingIds((currentIds) => currentIds.filter((id) => id !== imdbID));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        isUpdating,
        loading,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

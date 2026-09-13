import { Link } from "react-router-dom";
import { useWishlist } from "../src/context/WishlistContext";

function MovieCard({ movie }) {
  const { toggleWishlist, isInWishlist, isUpdating } = useWishlist();

  const saved = isInWishlist(movie.imdbID);
  const updating = isUpdating(movie.imdbID);
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <article className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
        <Link to={`/movie/${movie.imdbID}`}>
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={hasPoster ? movie.Poster : "/placeholder-movie.webp"}
                alt={movie.Title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder-movie.webp";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
            </Link>
            {/* Wishlist Button */}
            ...
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          disabled={updating}
          onClick={() => toggleWishlist(movie)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition ${
            updating
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : saved
                ? "bg-red-500 text-white"
                : "bg-black/60 text-white hover:bg-red-500"
          }`}
        >
          {updating ? "..." : saved ? "♥" : "♡"}
        </button>

        {/* Year */}
        <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs text-gray-200">
          {movie.Year}
        </span>
      </div>

      {/* Movie Information */}
      <div className="p-4">
        <Link to={`/movie/${movie.imdbID}`}>
          <h2 className="text-white font-semibold text-base line-clamp-2 min-h-12 hover:text-blue-400 transition">
            {movie.Title}
          </h2>
        </Link>

        <Link
          to={`/movie/${movie.imdbID}`}
          className="block mt-4 w-full text-center py-2.5 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white text-sm font-medium transition"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default MovieCard;

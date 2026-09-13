import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/movieApi";
import { useWishlist } from "../src/context/WishlistContext";

function MovieDetails() {
  const navigate = useNavigate();
  const { imdbId } = useParams();

  const { toggleWishlist, isInWishlist, isUpdating } = useWishlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieDetails(imdbId, controller.signal);

        setMovie(data);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Movie details error:", error);

        setError(
          error.response?.data?.message || "Failed to load movie details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();

    return () => {
      controller.abort();
    };
  }, [imdbId, retryCount]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>

        <p className="text-center text-gray-500 mt-5">
          Loading movie details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 text-lg">{error}</p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setRetryCount((count) => count + 1)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  const saved = isInWishlist(movie.imdbID);
  const updating = isUpdating(movie.imdbID);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
      >
        ← Back to Movies
      </button>

      {/* Main Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 border border-gray-800">
        {/* Background blur */}
        {hasPoster && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl scale-110"
            style={{
              backgroundImage: `url(${movie.Poster})`,
            }}
          />
        )}

        <div className="relative grid md:grid-cols-[300px_1fr] gap-8 p-5 sm:p-8 md:p-10">
          {/* Poster */}
          <div>
            {hasPoster ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500">No Poster Available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="text-white">
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
                  {movie.Title}
                </h1>

                <p className="text-gray-400 mt-3">
                  {movie.Year}
                  {movie.Runtime && ` • ${movie.Runtime}`}
                  {movie.Rated && ` • ${movie.Rated}`}
                </p>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(movie)}
                disabled={updating}
                className={`shrink-0 px-5 py-3 rounded-xl font-medium transition ${
                  updating
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : saved
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                {updating
                  ? "Saving..."
                  : saved
                    ? "♥ Saved"
                    : "♡ Add to Wishlist"}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-6">
              <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-yellow-400 text-lg">★</span>

                <span className="text-white font-bold ml-2">
                  {movie.imdbRating || "N/A"}
                </span>

                <span className="text-gray-500 ml-1">/ 10</span>
              </div>

              {movie.imdbVotes && (
                <span className="text-gray-500 text-sm">
                  {movie.imdbVotes} votes
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.Genre && (
              <div className="flex flex-wrap gap-2 mt-6">
                {movie.Genre.split(",").map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-3">Overview</h2>

              <p className="text-gray-300 leading-7">
                {movie.Plot && movie.Plot !== "N/A"
                  ? movie.Plot
                  : "No plot information available."}
              </p>
            </div>

            {/* Movie Information */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mt-8 pt-8 border-t border-gray-800">
              <Info label="Director" value={movie.Director} />

              <Info label="Actors" value={movie.Actors} />

              <Info label="Language" value={movie.Language} />

              <Info label="Country" value={movie.Country} />

              <Info label="Released" value={movie.Released} />

              <Info label="Awards" value={movie.Awards} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-gray-200 mt-1">
        {value && value !== "N/A" ? value : "N/A"}
      </p>
    </div>
  );
}

export default MovieDetails;

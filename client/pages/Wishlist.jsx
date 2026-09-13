import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useWishlist } from "../src/context/WishlistContext";

function Wishlist() {
  const { wishlist, loading, error } = useWishlist();

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        </div>

        <p className="text-center text-gray-500 mt-5">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Wishlist</h1>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Your wishlist is empty.</p>

          <Link
            to="/"
            className="inline-block mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {wishlist.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;

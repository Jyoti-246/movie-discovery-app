import { Link, useLocation } from "react-router-dom";
import { useWishlist } from "../src/context/WishlistContext";

function Navbar() {
  const location = useLocation();
  const { wishlist } = useWishlist();

  const isHome = location.pathname === "/";
  const isWishlist = location.pathname === "/wishlist";

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>

          <span className="text-xl sm:text-2xl font-bold text-white">
            Cine<span className="text-blue-500">Verse</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              isHome
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Home
          </Link>

          <Link
            to="/wishlist"
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition ${
              isWishlist
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "../pages/Wishlist";

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:imdbId" element={<MovieDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies, getDiscoveryMovies } from "../services/movieApi";
import MovieCard from "../components/MovieCard";

const categories = [
  "Avengers",
  "Batman",
  "Harry Potter",
  "Spider-Man",
  "Star Wars",
  "Jurassic",
];

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [query, setQuery] = useState(searchQuery);

  const [movies, setMovies] = useState([]);

  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const loadedPagesRef = useRef({});

  const [discoveryMovies, setDiscoveryMovies] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [discoveryError, setDiscoveryError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Avengers");
  const [sortOption, setSortOption] = useState("relevance");

  // Keep input synchronized with URL
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  // Fetch movies whenever search/page changes
  useEffect(() => {
    if (!searchQuery) {
      setMovies([]);
      setTotalResults(0);
      loadedPagesRef.current = {};
      return;
    }

    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setError("");

        const cacheKey = `${searchQuery.toLowerCase()}-${currentPage}`;

        // Don't request the same query + page twice
        if (loadedPagesRef.current[cacheKey]) {
          return;
        }

        if (currentPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const data = await searchMovies(
          searchQuery,
          currentPage,
          controller.signal,
        );

        const newMovies = data.movies || [];

        if (currentPage === 1) {
          setMovies(newMovies);
        } else {
          setMovies((currentMovies) => {
            const existingIds = new Set(
              currentMovies.map((movie) => movie.imdbID),
            );

            const uniqueMovies = newMovies.filter(
              (movie) => !existingIds.has(movie.imdbID),
            );

            return [...currentMovies, ...uniqueMovies];
          });
        }

        setTotalResults(data.totalResults || 0);

        loadedPagesRef.current[cacheKey] = true;
      } catch (error) {
        // Ignore cancelled requests
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Search error:", error);

        setError(error.response?.data?.message || "Failed to load movies");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [searchQuery, currentPage]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiscoveryMovies = async () => {
      try {
        setDiscoveryLoading(true);
        setDiscoveryError("");

        const data = await getDiscoveryMovies(
          activeCategory,
          controller.signal,
        );

        setDiscoveryMovies(data.movies || []);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setDiscoveryMovies([]);

        setDiscoveryError(
          error.response?.data?.message || "Failed to load movies",
        );
      } finally {
        if (!controller.signal.aborted) {
          setDiscoveryLoading(false);
        }
      }
    };

    fetchDiscoveryMovies();

    return () => {
      controller.abort();
    };
  }, [activeCategory]);
  // Search
  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setSearchParams({
      search: trimmedQuery,
      page: "1",
    });
  };

  // Load next page
  const handleLoadMore = () => {
    if (loadingMore) {
      return;
    }

    if (movies.length >= totalResults) {
      return;
    }

    const nextPage = currentPage + 1;

    setSearchParams({
      search: searchQuery,
      page: String(nextPage),
    });
  };

  const hasMoreMovies = movies.length < totalResults && currentPage < 100;

  const sortedMovies = useMemo(() => {
    const result = [...movies];

    const getYear = (year) => {
      const match = year?.match(/\d{4}/);
      return match ? Number(match[0]) : 0;
    };

    switch (sortOption) {
      case "title-asc":
        return result.sort((a, b) => a.Title.localeCompare(b.Title));

      case "title-desc":
        return result.sort((a, b) => b.Title.localeCompare(a.Title));

      case "newest":
        return result.sort((a, b) => getYear(b.Year) - getYear(a.Year));

      case "oldest":
        return result.sort((a, b) => getYear(a.Year) - getYear(b.Year));

      default:
        return result;
    }
  }, [movies, sortOption]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-10 sm:py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white">
          Discover Your Next
          <span className="text-blue-500"> Favorite Movie</span>
        </h1>

        <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
          Search thousands of movies and explore their details, ratings and
          more.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mt-8 flex gap-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="flex-1 px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Search
          </button>
        </form>

        <div className="mt-8">
          <p className="text-gray-500 text-sm mb-3">Explore</p>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                }}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && currentPage === 1 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 mx-auto border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />

          <p className="text-gray-500 mt-5">Searching movies...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && movies.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Search Results
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Showing {movies.length} of {totalResults} movies
                  </p>
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="title-asc">Title: A → Z</option>
                  <option value="title-desc">Title: Z → A</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {/* Load More */}
          {movies.length > 0 && movies.length < totalResults && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium transition"
              >
                {loadingMore ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}

          {movies.length > 0 && movies.length >= totalResults && (
            <p className="text-center text-gray-500 mt-10">
              You've reached the end of the results.
            </p>
          )}
        </section>
      )}

      {!searchQuery && (
        <section className="pb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Explore Movies</h2>

              <p className="text-gray-500 text-sm mt-1">
                Discover movies without searching
              </p>
            </div>
          </div>

          {discoveryLoading && (
            <div className="text-center py-16">
              <div className="w-10 h-10 mx-auto border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />

              <p className="text-gray-500 mt-5">Loading movies...</p>
            </div>
          )}

          {!discoveryLoading && discoveryError && (
            <div className="text-center py-16">
              <p className="text-red-400">{discoveryError}</p>
            </div>
          )}

          {!discoveryLoading &&
            !discoveryError &&
            discoveryMovies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {discoveryMovies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            )}
        </section>
      )}

      {/* Empty state */}
      {!loading && searchQuery && movies.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔎</div>

          <h2 className="text-xl font-semibold text-white">No movies found</h2>

          <p className="text-gray-500 mt-2">
            Try searching with a different movie title.
          </p>
        </div>
      )}

      {/* Initial state */}
      {!searchQuery && (
        <div className="text-center pb-16">
          <p className="text-gray-500">Search for a movie to get started.</p>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </main>
  );
}

export default Home;

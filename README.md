# 🎬 Movie Discovery App

A full-stack movie discovery application built with React, Node.js, Express, MongoDB, and the OMDb API.

The application allows users to discover movies, search for movies, sort results, load more results, view detailed movie information, and maintain a persistent wishlist.

---

## 🚀 Features

- Browse movies without manually entering a search query
- Movie discovery categories
- Search movies by title
- Pagination with "Load More"
- Sort movies by:
  - Relevance
  - Title A-Z
  - Title Z-A
  - Newest
  - Oldest
- Movie details page
- Add/remove movies from wishlist
- Wishlist persists in MongoDB
- Responsive UI for different screen sizes
- Loading states
- Empty states
- Error handling
- Retry option for failed movie detail requests
- Request cancellation using `AbortController`
- External API timeout handling
- OMDb API rate-limit handling
- Duplicate wishlist prevention
- Backend abstraction for third-party API
- API key kept on the server

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Axios
- Mongoose
- MongoDB Atlas
- CORS
- dotenv

### External API

- OMDb API

---

## 🏗️ Architecture

The frontend does not communicate directly with the OMDb API.

Instead, all movie requests go through the Node.js backend.

```text
React Frontend
      ↓
    Axios
      ↓
Node.js + Express
      ↓
 Movie Service
      ↓
   OMDb API
```

Wishlist requests use MongoDB:

```text
React Frontend
      ↓
    Axios
      ↓
Node.js + Express
      ↓
   Mongoose
      ↓
MongoDB Atlas
```

This keeps the OMDb API key private and allows the backend to control API requests, validation, error handling, and response transformation.

---

## 📁 Project Structure

```text
movie-discovery/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── MovieCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── context/
│   │   │   └── WishlistContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── movieApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── movieController.js
│   │   └── wishlistController.js
│   │
│   ├── models/
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── movieRoutes.js
│   │   └── wishlistRoutes.js
│   │
│   ├── services/
│   │   └── movieService.js
│   │
│   ├── server.js
│   ├── .env
│   └── .gitignore
│
└── README.md
```

---

## 🔌 API Endpoints

### Movie APIs

#### Search Movies

```http
GET /api/movies/search?query=batman&page=1
```

Example response:

```json
{
  "movies": [],
  "totalResults": 123,
  "page": 1
}
```

---

#### Discover Movies

```http
GET /api/movies/discover?query=avengers
```

This endpoint is used for the predefined discovery categories.

---

#### Movie Details

```http
GET /api/movies/:imdbId
```

Example:

```http
GET /api/movies/tt4154796
```

---

### Wishlist APIs

#### Get Wishlist

```http
GET /api/wishlist
```

---

#### Add Movie

```http
POST /api/wishlist
```

Request body:

```json
{
  "imdbID": "tt4154796",
  "Title": "Avengers: Endgame",
  "Year": "2019",
  "Poster": "poster-url",
  "Type": "movie"
}
```

---

#### Remove Movie

```http
DELETE /api/wishlist/:imdbID
```

Example:

```http
DELETE /api/wishlist/tt4154796
```

---

## 🗄️ Wishlist Data Model

Wishlist documents use the following structure:

```text
imdbID
Title
Year
Poster
Type
createdAt
updatedAt
```

`imdbID` is unique to prevent the same movie from being added multiple times.

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
OMDB_API_KEY=your_omdb_api_key
CLIENT_URL=http://localhost:5173
```

Do not commit `.env` to GitHub.

---

## ▶️ Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd movie-discovery
```

---

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create the `.env` file and add the required environment variables.

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:4000
```

---

### 3. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔄 How Movie Search Works

When a user searches for a movie:

```text
User enters movie name
        ↓
React updates search parameters
        ↓
Axios sends request to Node backend
        ↓
Express receives request
        ↓
Movie controller validates request
        ↓
Movie service calls OMDb API
        ↓
Backend transforms the response
        ↓
React receives movie data
        ↓
Movie cards are displayed
```

---

## 📄 Pagination / Load More

The OMDb API supports page-based results.

The application keeps track of the current page.

For example:

```text
Page 1 → 10 movies
Page 2 → next 10 movies
Page 3 → next 10 movies
```

When the user clicks **Load More**, the next page is requested and the new movies are appended to the existing results.

Duplicate IMDb IDs are filtered before adding new movies.

The application also uses request cancellation to prevent outdated requests from updating the UI.

---

## ⚡ Request Cancellation

Rapid search changes can create multiple API requests.

For example:

```text
bat
batm
batma
batman
```

Instead of allowing old requests to continue unnecessarily, the application uses `AbortController`.

When the search changes, the previous request can be cancelled.

This helps prevent:

- stale results
- unnecessary processing
- race conditions
- incorrect UI updates

---

## 🛡️ Error Handling

The application handles different failure scenarios.

### Empty search

The backend returns:

```http
400 Bad Request
```

when the search query is missing.

### Movie not found

The backend returns:

```http
404 Not Found
```

### External API unavailable

The backend returns:

```http
502 Bad Gateway
```

### External API timeout

The OMDb Axios client uses a timeout.

If the request takes too long:

```http
504 Gateway Timeout
```

is returned.

### API rate limit

If the OMDb request limit is reached:

```http
429 Too Many Requests
```

is returned with a user-friendly message.

---

## 💾 Wishlist Persistence

The wishlist is stored in MongoDB rather than only in browser state.

Therefore:

```text
Add movie
    ↓
POST request
    ↓
Express
    ↓
MongoDB
```

When the application starts again:

```text
React
  ↓
GET /api/wishlist
  ↓
MongoDB
  ↓
Wishlist restored
```

This means wishlist data persists across page refreshes and browser sessions.

---

## 🎨 Responsive Design

The UI uses responsive Tailwind CSS classes.

Movie cards adapt to different screen sizes:

```text
Mobile      → 2 columns
Small       → 3 columns
Medium      → 4 columns
Large       → 5 columns
```

Posters use a fixed aspect ratio so that different poster sizes do not break the layout.

Long movie titles are limited to multiple lines to prevent cards from becoming excessively tall.

---

## 🧠 Design Decisions

### Why Node.js backend?

The assignment requires the client to communicate with the backend instead of directly calling the third-party movie API.

Node.js + Express provides a simple API layer between React and OMDb.

---

### Why a service layer?

Movie API logic is kept inside:

```text
server/services/movieService.js
```

Controllers handle HTTP requests and responses, while the service handles communication with OMDb.

This keeps responsibilities separated and makes the application easier to maintain.

---

### Why MongoDB?

MongoDB is suitable for storing wishlist documents because the data structure is simple and document-based.

Mongoose provides schema validation and convenient database operations.

---

### Why React Context for wishlist?

Wishlist state is required by multiple components such as:

- MovieCard
- MovieDetails
- Navbar
- Wishlist page

React Context avoids passing wishlist data through multiple levels of props.

---

### Why URL search parameters?

Search state and page number are stored in the URL.

Example:

```text
/?search=batman&page=2
```

This allows users to:

- refresh without losing the current search
- use browser back/forward navigation
- share the current search URL
- preserve search context while navigating to movie details

---

## 🔐 Security Considerations

The OMDb API key is stored in the backend `.env` file.

The React application never receives the OMDb API key.

```text
❌ React → OMDb API
```

Instead:

```text
✅ React → Backend → OMDb API
```

`.env` is also excluded from Git using `.gitignore`.

---

## ⚠️ Assumptions & Limitations

### Shared Wishlist

The current application does not have authentication.

Therefore, the wishlist is shared at the application/database level rather than being associated with individual users.

A future version can add authentication and associate each wishlist item with a user ID.

### OMDb API limitations

The application depends on the availability and limits of the OMDb API.

If the external service is unavailable or the API request limit is reached, movie data cannot be retrieved.

### Search-based discovery

The OMDb API is primarily search-oriented, so the discovery section uses predefined movie search categories rather than a traditional genre-based discovery endpoint.

---

## 🤖 AI Usage Disclosure

AI tools were used during development as a development assistant.

They were mainly used for:

- discussing application architecture
- debugging errors
- reviewing implementation approaches
- generating/refining boilerplate code
- improving error handling
- improving responsive UI patterns
- reviewing edge cases
- preparing documentation

The final implementation was reviewed, tested, and integrated manually.

---

## 🚀 Future Improvements

Possible improvements include:

- User authentication
- User-specific wishlists
- Genre-based discovery
- More advanced filtering
- Debounced search
- Server-side caching
- Request deduplication
- Redis caching
- Better API quota management
- Infinite scrolling
- Movie recommendations
- Ratings and reviews
- Unit and integration tests
- CI/CD pipeline
- Production monitoring

---

## 🧪 Testing Checklist

Before submission, verify:

- [ ] Home page loads
- [ ] Discovery categories work
- [ ] Search works
- [ ] Empty search is handled
- [ ] Load More works
- [ ] Sorting works
- [ ] Movie details page works
- [ ] Back navigation preserves search context
- [ ] Wishlist add works
- [ ] Wishlist remove works
- [ ] Wishlist persists after refresh
- [ ] Duplicate wishlist items are prevented
- [ ] Missing poster is handled
- [ ] Long movie titles do not break cards
- [ ] API errors show a useful message
- [ ] Retry button works
- [ ] Mobile layout works
- [ ] `.env` is not committed
- [ ] Frontend does not directly call OMDb

---

## 👩‍💻 Author

Developed as a Full-Stack Development Assignment.

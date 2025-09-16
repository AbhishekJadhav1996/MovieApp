# MovieApp — Microservices + Stunning Homepage

This repository contains a React frontend, a Node/Express movie service, and a lightweight API Gateway that stitches them together in a simple microservices architecture. The homepage was redesigned with a hero carousel, navbar, feature banner, and stats strip.

## Architecture Overview

- **Frontend** (`movi-app-frontend-master`)
  - React app with a cinematic homepage and movie CRUD UI.
  - Calls a single base URL (`REACT_APP_API_BASE_URL`) exposed by the API Gateway.
- **API Gateway** (`api-gateway`)
  - Small Express server using `http-proxy-middleware`.
  - Proxies `/api/movies` to the upstream Movie Service. This decouples the frontend from service details and allows adding services behind one gateway endpoint in the future.
- **Movie Service** (`movi-app-backend-master`)
  - Node/Express + Mongoose app exposing movie endpoints under `/api/movies`.
  - Connects to MongoDB via `src/config/db.js`.

```
Frontend (React)  -->  API Gateway (Express Proxy)  -->  Movie Service (Express + MongoDB)
```

## How Microservices Are Implemented Here

- **Service separation**: The gateway and movie service are independent Node apps with their own `package.json` and ports.
- **Gateway proxy**: The gateway proxies requests from `/api/movies` to the movie service upstream URL (`MOVIE_SERVICE_URL`, default `http://localhost:5000`).
- **Stable frontend API**: The frontend only talks to the gateway at `REACT_APP_API_BASE_URL` (default `http://localhost:8000/api`).
- **Extensibility**: Additional services (e.g., `user-service`, `review-service`) can be mounted under the gateway without changing the frontend.

## Project Structure

```
MovieApp/
├─ api-gateway/
│  ├─ server.js
│  └─ package.json
├─ movi-app-backend-master/
│  ├─ bin/www                   # entry; requires ../src/app
│  ├─ src/app.js                # express app, routes, CORS
│  ├─ src/routes/movieRoutes.js
│  ├─ src/controllers/movieController.js
│  ├─ src/models/Movie.js
│  ├─ src/config/db.js
│  └─ package.json
└─ movi-app-frontend-master/
   ├─ src/App.js                # mounts navbar/banner/stats, list/form
   ├─ src/api.js                # axios with REACT_APP_API_BASE_URL
   ├─ src/components/           # Navbar, FeatureBanner, StatsStrip, etc.
   ├─ src/assets/heros/         # background hero images
   └─ package.json
```

## Request Flow

1. User opens the React app and sees a full-screen hero carousel.
2. Frontend requests movies via `GET {REACT_APP_API_BASE_URL}/movies`.
3. API Gateway receives `/api/movies` and proxies to `{MOVIE_SERVICE_URL}/api/movies`.
4. Movie Service queries MongoDB and returns data to the gateway, which forwards it to the frontend.
5. On create (`POST /api/movies`), the new movie is saved, then the UI updates with smooth animations.

## Ports and Environment Variables

- **API Gateway**
  - Port: `8000` (default)
  - Env: `PORT=8000`, `MOVIE_SERVICE_URL=http://localhost:5000`
- **Movie Service**
  - Port: `5000` (default via `bin/www`)
  - Typical env: `PORT=5000`, `MONGO_URI=...`, `NODE_ENV=development`
- **Frontend**
  - Dev server port: `3000` (CRA default)
  - Env: `REACT_APP_API_BASE_URL=http://localhost:8000/api`

## Setup and Run (Windows PowerShell)

1) Movie Service
```
cd .\movi-app-backend-master
npm install
# Ensure MongoDB is running and MONGO_URI is set if needed
$env:PORT="5000"
npm start
```

2) API Gateway
```
cd ..\api-gateway
npm install
$env:PORT="8000"
$env:MOVIE_SERVICE_URL="http://localhost:5000"
npm start
```

3) Frontend
```
cd ..\movi-app-frontend-master
npm install
# Optional; defaults to http://localhost:8000/api if not set
$env:REACT_APP_API_BASE_URL="http://localhost:8000/api"
npm start
```

Open `http://localhost:3000` in your browser.

## Key Files Changed for Microservices + UI

- `api-gateway/server.js`: Express proxy for `/api/movies` -> movie service.
- `movi-app-backend-master/bin/www`: Fixed to require `../src/app`.
- `movi-app-frontend-master/src/api.js`: Uses `REACT_APP_API_BASE_URL` (defaults to gateway).
- Homepage enhancements (frontend):
  - Components: `Navbar`, `FeatureBanner`, `StatsStrip`, existing `HeroCarousel`.
  - Layout: `src/App.js` wires components together.
  - Styles: `src/index.css` adds navbar/banner/stats styling.

## API Endpoints (via Gateway)

- `GET /api/movies` — list movies
- `POST /api/movies` — create movie

These forward 1:1 to the movie service at `{MOVIE_SERVICE_URL}/api/movies`.

## Troubleshooting

- Error: `Cannot find module '../app'` from backend
  - Ensure `movi-app-backend-master/bin/www` requires `../src/app`.
- CORS issues
  - Gateway and service both enable CORS. Verify ports and base URLs are correct.
- Frontend not hitting gateway
  - Confirm `REACT_APP_API_BASE_URL` (or default) is `http://localhost:8000/api`.

## Next Steps (Optional)

- Containerize with Docker Compose for all services.
- Add more services (auth, reviews) behind the gateway.
- Add caching and rate limiting at the gateway.
- CI/CD and production configs (TLS, observability).

— Enjoy the show! 🎬

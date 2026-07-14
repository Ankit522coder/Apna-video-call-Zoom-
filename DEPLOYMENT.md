# Render Deployment

This project is meant to be deployed as two Render services:

1. Backend: Node web service from `Backend/`
2. Frontend: React static site from `frontend/`

## Backend service

- Root directory: `Backend`
- Build command: leave default or use `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT=10000` or let Render inject its own port
  - `MONGO_URI=your MongoDB Atlas connection string`
  - `FRONTEND_URL=https://your-frontend.onrender.com`

## Frontend service

- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`
- Environment variables:
  - `REACT_APP_BACKEND_URL=https://your-backend.onrender.com`

## Notes

- The frontend uses `REACT_APP_BACKEND_URL` at build time, so set it before the static site is built.
- The backend only allows requests from `FRONTEND_URL`, so update that value after the frontend URL is known.
- Keep the MongoDB Atlas URI URL-encoded, especially the password.
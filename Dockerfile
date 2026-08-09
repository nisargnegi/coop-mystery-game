# Stage 1: Build the frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the backend and serve the app
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend from Stage 1 to a level above backend so index.js can find it at '../frontend/dist'
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

EXPOSE 3005
CMD ["node", "index.js"]

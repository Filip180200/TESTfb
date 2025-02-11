# Multi-stage build for frontend and backend

# Frontend Build Stage
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build-prod

# Backend Build Stage
FROM node:16-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Final Stage
FROM node:16-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy backend files
COPY --from=backend-build /app/backend ./backend

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

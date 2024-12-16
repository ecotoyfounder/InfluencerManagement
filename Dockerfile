# Base image for Python dependencies
FROM python:3.9 AS python-base

# Install Python dependencies
WORKDIR /backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Base image for Node.js dependencies
FROM node:18 AS node-base

# Install Node.js dependencies and build the frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend files and build
COPY frontend/ ./
RUN npm run build

# Final application setup
FROM python:3.9

# Copy backend files
WORKDIR /backend
COPY backend/ /backend

# Install Python dependencies again in the final stage
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create the static folder in the backend
RUN mkdir -p /backend/static

# Copy frontend build to the static folder in the backend
COPY --from=node-base /frontend/build/* /backend/static

# Command to start the backend
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

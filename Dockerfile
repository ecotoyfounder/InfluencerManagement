# Base image for Python
FROM python:3.9 AS python-base

# Base image for Node.js
FROM node:18 AS node-base

# Install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies and build the frontend
COPY frontend /app/frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps && npm run build

# Final application setup
FROM python:3.9
COPY --from=python-base /app/backend /app/backend
COPY --from=node-base /app/frontend/build /app/backend/static

# Command to start the backend
WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

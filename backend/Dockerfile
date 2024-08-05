# Stage 1: Build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Run
FROM node:18-alpine AS run

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

ENV NODE_ENV=test
# Expose the port the app runs on
EXPOSE 3018

# Command to run the app
CMD ["npm", "start"]

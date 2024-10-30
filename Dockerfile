# Stage 1: Build the frontend app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Set environment to production (if needed)
# ENV NODE_ENV=production

# Build the frontend for production
# RUN npm run build --verbose

# Stage 2: Serve the frontend using Nginx
# FROM nginx:stable-alpine

# Copy the build files from the first stage into the Nginx web root
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 5173

# Start Nginx when the container launches
CMD ["npm", "run", "dev", "--", "--host" ]

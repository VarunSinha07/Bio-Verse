# Use Node.js as the base image
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]

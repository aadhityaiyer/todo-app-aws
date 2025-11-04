# Step 1: Start from an official Node.js base image
FROM node:18-alpine

# Step 2: Set the "working directory" inside the container
WORKDIR /app

# Step 3: Copy the package.json file first.
# This is a trick to speed up future builds.
COPY package*.json ./

# Step 4: Install the app's dependencies (Express.js)
RUN npm install

# Step 5: Copy the rest of your app's code (server.js, public folder)
COPY . .

# Step 6: Tell Docker the app runs on port 3000
EXPOSE 3000

# Step 7: The command to run when the container starts
CMD ["node", "server.js"]

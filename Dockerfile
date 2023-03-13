FROM node:12

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Set the environment variable to specify the port that the app will listen to
ENV PORT=3000

# Expose the port that the app will listen to
EXPOSE $PORT

# Run the app when the container starts
CMD [ "node", "app.js" ]

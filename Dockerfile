# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy application code
# COPY . .

# # Expose the port your app listens on
# EXPOSE 3000

# # Start the app
# CMD ["node", "server.js"]

FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npx tsc
EXPOSE 3000
CMD ["node", "dist/server.js"]
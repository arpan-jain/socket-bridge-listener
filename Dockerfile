FROM node:21.6-bookworm as builder

WORKDIR /socket-bridge-event

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:21.6-bookworm

WORKDIR /socket-bridge-event

# Copy only the build files and node_modules from the builder stage
COPY --from=builder /socket-bridge-event/dist ./dist
COPY --from=builder /socket-bridge-event/node_modules ./node_modules
COPY --from=builder /socket-bridge-event/package*.json ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "run", "start:prod"]

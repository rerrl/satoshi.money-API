# Builder stage
FROM node:16-alpine3.15 as builder

# Copy the application files and .env file
COPY . /home/node/app
COPY .env /home/node/app/.env
WORKDIR /home/node/app

# Install dependencies and build the project
RUN npm ci && \
    npm install -g @nestjs/cli && \
    npm run build

# Application stage
FROM node:16-alpine3.15 as app
WORKDIR /home/node/app

# Copy built artifacts and modules from the builder stage
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/.env ./ 

# Run
CMD ["node", "dist/main.js"]

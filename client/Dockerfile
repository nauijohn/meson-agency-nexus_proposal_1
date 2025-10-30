# --------------------------
# Stage 1: Development
# --------------------------
FROM node:22-alpine AS development

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command for dev environment
CMD ["pnpm", "run", "dev", "--host"]

# --------------------------
# Stage 2: Production
# --------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files
COPY pnpm-lock.yaml package.json ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built source code from dev stage
COPY --from=development /app ./

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the app
RUN pnpm run build

# --------------------------
# Stage 3: Production
# --------------------------
FROM node:22-alpine AS production

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=development /app/vite.config.ts ./vite.config.ts

# Expose Vite preview port
EXPOSE 4173

# Run production build using Vite's preview
CMD ["pnpm", "run", "preview", "--host", "--port", "4173"]

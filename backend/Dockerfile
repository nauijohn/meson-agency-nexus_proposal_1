# ----------------------
# Stage 1: Development / Build
# ----------------------
FROM node:22-alpine AS development

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install deps (including dev for build)
RUN pnpm install

# Copy source code
COPY . .

# Default command for dev
CMD ["pnpm", "start:debug-docker"]

# ----------------------
# Stage 2: Dependencies
# ----------------------
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only package files for production install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built code from development stage
COPY --from=development /app ./

RUN pnpm build


# ----------------------
# Stage 3: Production
# ----------------------
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=deps /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
# # Expose your app port
# EXPOSE 3000

# # Start the app in production
CMD ["node", "dist/src/main.js"]
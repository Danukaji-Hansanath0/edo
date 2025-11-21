# syntax=docker/dockerfile:1
# --- Build Stage ---
FROM node:20-alpine AS build

# Set workdir
WORKDIR /app

# Install deps separately for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Choose npm; allow switching to other managers if lockfile present
RUN npm install --legacy-peer-deps

# Copy rest of source
COPY . .

# Build Next.js app (outputs to .next)
RUN npm run build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only necessary artifacts from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose Next.js default port
EXPOSE 3001

USER app

# Run Next.js
CMD ["npm", "run", "start"]

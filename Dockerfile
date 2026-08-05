# Lightweight, current Node LTS base
FROM node:24-alpine

WORKDIR /app

# Install dependencies first so this layer is cached and only
# re-runs when package.json / package-lock.json actually change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Now copy the rest of the application source.
COPY . .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Run as the non-root "node" user baked into the official image
# instead of root, for defense-in-depth.
USER node

# Hits the home route ("/") which doesn't touch the DB, so the app
# container reports healthy as soon as Express itself is serving.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${PORT}/" || exit 1

CMD ["node", "app.js"]

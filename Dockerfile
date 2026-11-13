# ---
# build stage image
# ---
FROM node:26-alpine AS build

# set current directory
WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy all files and run build
COPY . .
RUN npm run build

# ---
# actual image
# ---
FROM node:26-alpine

# install tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# set current directory
WORKDIR /app

# install chromium manually
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# install production dependencies only
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci

# copy all needed files from build stage image
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

EXPOSE 3000

CMD ["node", "server/index.js"]

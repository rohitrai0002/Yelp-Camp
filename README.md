# YelpCamp

A campground listing app built with Express, EJS, and MongoDB.

## Running locally without Docker

```
npm install
node app.js
```

Requires a MongoDB instance reachable at the URI in `.env` (copy `.env.example` to `.env` and adjust `MONGO_URI` if needed — defaults to `mongodb://127.0.0.1:27017/yelp-camp`).

To load sample data: `node seeds/index.js`.

## Running with Docker

This repo ships a `Dockerfile` for the app and a `docker-compose.yml` that runs the app together with its own MongoDB container — no local MongoDB install needed.

### First run / after cloning

```
docker compose up --build
```

This builds the app image, starts MongoDB (with a named volume for persistent data), waits for MongoDB to report healthy, then starts the app. Visit **http://localhost:4000**.

The containerized MongoDB is also reachable from your host machine (e.g. for Compass/mongosh) at `mongodb://127.0.0.1:27018` — mapped to `27018` instead of the default `27017` so it won't clash with a MongoDB instance already installed locally. Inside the Docker network the app always talks to it as `mongo:27017`.

The database will be empty on a fresh volume. To seed sample data into the containerized MongoDB:

```
docker compose exec app node seeds/index.js
```

### Stopping

```
docker compose down
```

This stops and removes the containers, but **keeps** the `mongo-data` volume — your data survives. To also wipe the database, add `-v`: `docker compose down -v`.

### Rebuilding after changing application code

Compose only rebuilds the image if you tell it to. After editing routes/views/etc.:

```
docker compose up --build
```

(`--build` forces a rebuild; without it, Compose reuses the existing image and your code changes won't appear.)

### Rebuilding after changing dependencies (package.json)

Same command — `docker compose up --build` — works here too. Because the `Dockerfile` copies `package.json`/`package-lock.json` and runs `npm ci` *before* copying the rest of the source, Docker only re-runs `npm ci` when those two files change, not on every code edit. If you want to force a totally clean install ignoring Docker's layer cache:

```
docker compose build --no-cache app
docker compose up
```

### Pushing the image to Docker Hub

```
docker build -t <your-dockerhub-username>/yelpcamp:latest .
docker login
docker push <your-dockerhub-username>/yelpcamp:latest
```

### Pulling and running from Docker Hub (another machine)

```
docker pull <your-dockerhub-username>/yelpcamp:latest
docker run -p 4000:4000 -e MONGO_URI=mongodb://<your-mongo-host>:27017/yelp-camp <your-dockerhub-username>/yelpcamp:latest
```

Or, simplest for a full local/EC2 setup: just clone the repo and run `docker compose up --build` — it builds the image itself and wires up MongoDB automatically, no separate push/pull needed.

## Environment variables

See `.env.example`. `PORT` (default `4000`) and `MONGO_URI` (default depends on context — see file comments).

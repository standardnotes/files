# Standard Notes Files Service

# Run locally with docker-compose

```
cp .env.sample .env
yarn install
docker-compose up
```

With the default settings, the app should be running at http://localhost:3030. The [`/healthcheck`](http://localhost:3030/healthcheck) endpoint should return OK.
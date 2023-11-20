# Technical Competence Test for Satoshi.money

# Overview

- nodejs
- nestjs framework
- typescript
- postgres via elephantsql
- prisma ORM

**To keep this simple for now, we are only concerned with updating the top 100 coins, sorted by market cap.**

To see caching and the query with pagination in action, see the `test/app.e2e-spec.ts` file. Check out [test section](#tests) below.

## Usage

install deps
`npm i`

Make sure to set up your .env vars. You will need to provide your db connection credentials. I will send this over in an email to use my elephant instance

```
DATABASE_URL=""
COINGECKO_API_URL="https://api.coingecko.com/api/v3"
UPDATE_COIN_CRON_INTERVAL_S=120
```

To run locally while interfacing with the deployed elephant db:
`npm run start:dev`

You are allowed 30 requests/min, and by default I have the update interval every 2 mins. You shouldnt have a problem with (429 - too many requests) but if you do, change you VPN location ;)

## Tests

`npm run test:e2e`

## Docker
To build the docker file, from the root of the project:
`docker build -t satoshi .`

To run
`docker run satoshi`

This container can easily be pushed to AWS ECR, then deployed to EC2 via shell scripts.
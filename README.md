# Technical Competence Test for Satoshi.money

# Overview

- nodejs
- nestjs framework
- typescript
- postgres via elephantsql
- prisma ORM

## Usage

install deps
`npm i`

Make sure to set up your .env vars. You will need to provide your db connection credentials. I will send this over in an email

```
DATABASE_URL=""
UPDATE_COIN_CRON_INTERVAL_S=120
```

To run locally while interfacing with the deployed elephant db:
`npm run start:dev`

You are allowed 30 requests/min, and by default I have the update interval every 2 mins. You shouldnt have a problem with (429 - too many requests) but if you do, change you VPN location ;)

To keep this simple for now, we are only concerned with updating the top 100 coins, sorted by market cap.
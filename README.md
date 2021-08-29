# Luftio App backend

## Installation

```bash
$ npm install
```

## Running the app

The app expects the database to be running on `localhost:5432`. 

To connect to the production database, use `ssh -L5432:localhost:5432 root@app.luftio.com`


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

First, connect to the correct server via ssh. Then run the following: 

```bash
$ cd app-backend
$ git pull origin master
$ npm run build
$ pm2 restart app-backend
```

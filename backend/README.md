## DB creation

1. Create free account in [Mondodb atlas cl](https://www.mongodb.com/cloud/atlas)
2. Create cluster and database user
3. Allow IP access to allow access from anywhere
4. Connect to cluster and save connection string.

## Initialize project
1. npm init -y to create basic package.json file.
2. Install dependencies
3. Create .env file and add connection string and port

## Run the application
```
npm start
```

## Access the application
```
http://localhost:5000
```

## Run the test
```
npm test
```

## Run the test along with coverage
```
npm run test:coverage
```

## Build docker file
```
docker buildx build -t user-portal-be .
```

## Run the container

```
docker run user-portal-be
```


# Welcome to the Overlappd Backend Server

We will document getting setup for running this server.

Before running the server, please follow these instructions:

1. Setting up a config.env file.
2. Installing npm packages.

## Setting up the config.env file.

Create a file at ./server/config/config.env. Proceed to copy these lines into the file:

```
PORT=5000

DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_CLUSTER=cluster0.vciooih
DATABASE_NAME=users

JWT_ACCESS_TOKEN_PHRASE=<phrase>
JWT_LIFETIME=20
```

Replace *\<username>* and *\<password>* being replaced with their respective values provided to you.

> The four DATABASE variables will eventually be used in creating the MongoDB's URI. This will take the format:
>
> mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/NAME

In addition to setting the DATABASE fields, the JWT_ACCESS_TOKEN_PHRASE will need to be filled in. The phrase used for running our tests is

```
JWT_ACCESS_TOKEN_PHRASE=Hv9Ay8AnfKK2KAIIhln4O1awCFSmTXXgW6IA6alDLyqtIm0DjFhzGCz4tjhw6kbIAPduv8xoH6hzQJZVUZLSRczPAX6j0aLO8IGR7v0flEmBTQ5x32ooWYfyKx7n7hgl
```
This phrase can be changed for alternative premises, but this will require new authorization headers to be generated in the tests.

Once the config.env file is setup, step two can be completed.

## Installing the Dependencies.

To install all needed dependencies, run:
```
npm i
```
or
```
npm install
```

After this, the server may be ran.

To run the server, execute the following command:

```
npm run startd-server
```

This will execute and alias for nodemon.

## Verifying the server is running correctly

To verify the server is running as it should be, either use Postman or the builtin routes.rest file.

To run the tests in the routes.rest file:

- On VS Code, install the REST Client extension. This should allow a *run request* button to appear above the tests. Output should be printed into a separate window. For more information on route.rest tests, [click here](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

- Other IDEs are currently not documented.
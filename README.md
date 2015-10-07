# userform
An example simple web form using hapi, swagger and react.

# Usage
Download or clone the repository and then install dependencies with
```sh
$ npm install
```

To rebuild all files, start the server and watch for changes run
```sh
$ gulp rebuild
```

If the files have already been built and you did not make any modifications while gulp was not running, you can simply start the server and watch for changes with
```sh
$ gulp
```

# Build system
Gulp is used as the main build system, the solution utilizes babel for ES6, browserify for module management, browsersync for live reloads.

# Frontend
React is used as the main frontend framework, Foundation is responsible for the general outlook and responsive behavior, and Rx is used for async event handling.

# Backend
Hapi is used as the main backend framework with Joi and Boom for validation. This solution uses [swagger](http://swagger.io/) to enable a design driven approach in development. The api is defined by 
```sh
src/backend/config/swagger.yaml
```
The api docs are automatically created and available at
```sh
http://localhost:3000/api-docs
```
An automatic UI is also provided for testing the api at
```sh
http://localhost:3000/api-test
```
The api-test functionality is enabled by the included swagger-route plugin that serves the swagger ui static files. This can be removed in production.

# Static files and Nginx
This kit includes a basic fileserver plugin that handles static files. In production it is advised to remove this plugin and use a reverse proxy like nginx for this.

# Code style
This project uses the [JavaScript Standard Style](http://standardjs.com/) as code style.

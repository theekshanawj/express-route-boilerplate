const express = require('express');

const { getFiles, getAbsolutePath, getFileNameAndExtension, isExtensionValid, getRoute } = require('./util');

const app = express();

/**
 * Application constants
 */
const ALLOWED_FILE_EXTENSIONS = ['js']; // Files allowed for controllers and middlwares
const ROOT_ROUTE_NAME = 'root'; // Default root route name
const DEFULT_PORT = 3000; // Default port

// Register routes
const registerRoutes = (basePath, pathToRoutes, rootRouteName) => {
  try {
    const routesFiles = getFiles(getAbsolutePath(basePath, pathToRoutes));
    if (routesFiles && routesFiles.length > 0) {
      routesFiles.forEach((file) => {
        const [routesFileName, extension] = getFileNameAndExtension(file);
        if (!isExtensionValid(extension, ALLOWED_FILE_EXTENSIONS)) return;
        try {
          // Import the route file
          const controllerRoutes = require(pathToRoutes + routesFileName);
          const route = getRoute(routesFileName, rootRouteName);
          // Register the routes
          route && app.use(route, controllerRoutes);
        } catch (e) {
          console.error('Error occurred importing routes', e);
        }
      });
    }
  } catch (err) {
    console.log('Error in accessing files', err);
  }
};

// Register middleware
const registerMiddlware = (basePath, pathToMiddleware) => {
  try {
    const middlewareFiles = getFiles(getAbsolutePath(basePath, pathToMiddleware));
    if (middlewareFiles && middlewareFiles.length > 0) {
      middlewareFiles.forEach((file) => {
        const [middlewareFileName, extension] = getFileNameAndExtension(file);
        if (!isExtensionValid(extension, ALLOWED_FILE_EXTENSIONS)) return;
        // Wrap around a another try catch to catch errors with require to avoid breaking the loop
        try {
          // Import the file
          const middlewares = require(pathToMiddleware + middlewareFileName);
          if (!middlewares) return;
          // Add middle-wares to the App
          Object.values(middlewares).forEach((fnc) => {
            app.use(fnc);
          });
        } catch (e) {
          console.error('Error occurred importing middleware file', e);
        }
      });
    }
  } catch (err) {
    console.error('Error occurred', err);
  }
};

/**
 * Main application : InitExpress.
 * @param {string} pathToRoutes - Specify the relative path to routes directory './controllers/'
 * Note: Ending / is required in the path.
 * @param {string} pathToMiddleware - Specify the relative path to middleware directory './middleware/
 * Note: Ending / is required in the path
 * @param {string} rootRouteName - Name of the file which is intended to use as root (/) routes of the application
 * @param {number} port - Port the application should start on
 * @param {Function} listenCallback - Function to be passed to express().listen callback
 */
const initExpress = ({ pathToRoutes, pathToMiddleware, rootRouteName, port, listenCallback }) => {
  // pathToRoutes should be defined
  if (!pathToRoutes) throw new Error('pathToRoutes should be defined');

  // Register middlware if middleware path is defined
  // Middlware should be registered before routes
  if (pathToMiddleware) {
    registerMiddlware(process.cwd(), pathToMiddleware);
  }

  // Register the routes in the application
  registerRoutes(process.cwd(), pathToRoutes, rootRouteName || ROOT_ROUTE_NAME);

  // Listen to defined port if defined, else default port
  app.listen(port || DEFULT_PORT, listenCallback);
};

module.exports = initExpress;
const express = require('express');

const { getFiles, getAbsolutePath, getFileNameAndExtension, isExtensionValid, getRoute } = require('./util');


const app = express();

const RELAVTIVE_PATH_TO_MIDDLWARES = './middleware/';
const RELAVTIVE_PATH_TO_CONTROLLERS = './controllers/';
const ALLOWED_FILE_EXTENSIONS = ['js'];
const ROOT_ROUTE_NAME = 'root';
const PORT = 3000;
const DEFULT_PORT = 3000;
const appListenCallback = () => {
	console.log('App started on port:',PORT);
}


const registerRoutes = (basePath, pathToRoutes, rootRouteName) => {
	try {
		const routesFiles = getFiles(getAbsolutePath(basePath, pathToRoutes));
		if (routesFiles && routesFiles.length > 0) {
			routesFiles.forEach((file) => {
				const [routesFileName, extension] = getFileNameAndExtension(file);
				if(!isExtensionValid(extension, ALLOWED_FILE_EXTENSIONS)) return;
				const controllerRoutes = require(pathToRoutes + routesFileName);
				const route = getRoute(routesFileName, rootRouteName);
				route && app.use(route, controllerRoutes);
			});
		}
	} catch(err) {
		console.log('Error in accessing files', err);
	}
}

const registerMiddlware = (basePath, pathToMiddleware) => {
	try {
		const middlewareFiles = getFiles(getAbsolutePath(basePath, pathToMiddleware));
		if (middlewareFiles && middlewareFiles.length > 0) {
			middlewareFiles.forEach((file) => {
				const [middlewareFileName, extension] = getFileNameAndExtension(file);
				if(!isExtensionValid(extension, ALLOWED_FILE_EXTENSIONS)) return;
				// Wrap around a another try catch to catch errors with require to avoid breaking the loop
				try {
					// Import the file
					const middlewares = require(pathToMiddleware + middlewareFileName);
					if (!middlewares) return;
					// Add middle-wares to the App
					Object.values(middlewares).forEach((fnc) => {
						app.use(fnc);
					});
				} catch(e) {
					console.error('Error occurred importing middleware file', e);
				}
			});
		}
	} catch(err) {
		console.error('Error occurred', err);
	}
}

const initExpress = ({ pathToRoutes, pathToMiddleware, rootRouteName, port, listenCallback }) => {

	// pathToRoutes should be defined
	if (!pathToRoutes) throw new Error('pathToRoutes should be defined');

	// Register middlware if middleware path is defined
	// Middlware should be registered before routes
	if (pathToMiddleware) {
		registerMiddlware(__dirname, pathToMiddleware);
	}

	// Register the routes in the application
	registerRoutes(__dirname, pathToRoutes, rootRouteName || ROOT_ROUTE_NAME);

	// Listen to defined port if defined, else default port
	app.listen(port || DEFULT_PORT, listenCallback);

}


initExpress({ pathToRoutes: RELAVTIVE_PATH_TO_CONTROLLERS, pathToMiddleware: RELAVTIVE_PATH_TO_MIDDLWARES, rootRouteName: ROOT_ROUTE_NAME, port: PORT, listenCallback: appListenCallback})

module.exports = initExpress;


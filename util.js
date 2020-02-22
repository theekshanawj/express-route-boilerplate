const fs = require('fs');
const path = require('path');

const DOT = '.'

// Get the files in a given path
const getFiles = (path) => {

	if (!path) return [];
	try {
		const files = fs.readdirSync(path);
		return files;
	} catch(err) {
		console.error('Error in retrieving files', err);
		throw err;
	}
};

// Except relative path as ./directory form
// Return basePath + relativePath. 
const getAbsolutePath = (basePath, relativePath) => {

	if(!basePath) return "";
	// Get the /directory from ./directory form
	const [, directory] = (relativePath || '').split(DOT);
	if (!directory) return "";
	return path.join(basePath, directory); 
};

// Get the file name and extension separately
const getFileNameAndExtension = (file) => {
	if(!file) return [null, null];
	return file.split(DOT);
}

// Is the extension passed included in the allowedExtension array
const isExtensionValid = (extension, allowedExtensions) => {
	if(!allowedExtensions || !Array.isArray(allowedExtensions)) return false;
	return allowedExtensions.includes(extension);
}

const getRoute = (routeName, ROOT_ROUTE_NAME) => {
	if (!routeName) return;
	if (routeName === ROOT_ROUTE_NAME) {
		return "/"
	}
	return path.join('/', routeName);
}


module.exports = { getFiles, getAbsolutePath, getFileNameAndExtension, isExtensionValid, getRoute };
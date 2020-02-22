const fs = require('fs');
const { getFiles, getAbsolutePath, getFileNameAndExtension, isExtensionValid, getRoute } = require('../util');

jest.mock('fs');

describe('Util tests', () => {
	describe('getFiles tests', () => {
		it('should get files in a given path when successful', () => {
			const files = ['file1.js', 'file2.txt'];

			fs.readdirSync.mockImplementation(() => {
				return files;
			});

			const filesInPath = getFiles('path');
			expect(filesInPath).toEqual(files);
		});
		it('should return an error if reading files has encountered an error', () => {

			const anError = new Error('file read error');
			fs.readdirSync.mockImplementation(() => {
				throw anError;
			});

			let err;

			try {
				getFiles('path');
			} catch(e) {
				err = e;
			}
			expect(err).toEqual(anError);

		});
		it('should return [] if the path is not defined', () => {
			const files = getFiles();
			expect(files).toEqual([]);	
		});
	})

	describe('getAbsolutePath test', () => {

		it('should get the absolute path concated with relative path', () => {
			const absolutePath = getAbsolutePath('path', './directory');
			expect(absolutePath).toBe('path/directory');
		});
		it('should get "" if the absolute path is undefined or falsy', () => {
			const absolutePath = getAbsolutePath(undefined, './directory');
			expect(absolutePath).toBe('');
		});
		it('should get "" if the relative path is not in ./directory format', () => {
			const absolutePath = getAbsolutePath('path', '/directory');
			expect(absolutePath).toBe('');
		});
		it('should get "" if the relative path is not defined', () => {
			const absolutePath = getAbsolutePath('path');
			expect(absolutePath).toBe('');
		});
	});

	describe('getFileNameAndExtension tests', () => {
		it('should get file and extension', () => {
			const fileAndExtension = getFileNameAndExtension('file.js');
			expect(fileAndExtension).toEqual(['file', 'js']);
		});
		it('should get empty result if the file is not defined', () => {
			const fileAndExtension = getFileNameAndExtension();
			expect(fileAndExtension).toEqual([null, null]);
		});
	});

	describe('isExtensionValid tests', () => {

		it('should validate the correct extension', () => {
			expect(isExtensionValid("js", ["js", "txt"])).toBe(true);
			expect(isExtensionValid("cpp", ["js", "txt"])).toBe(false);
		});
		it('should return false if the allowedExtensions is not defined or not an array', () => {
			expect(isExtensionValid("js")).toBe(false);
			expect(isExtensionValid("js", "js")).toBe(false);

		});

	});

	describe('getRoute tests', () => {

		it('should get the /router for non root route names', () => {
			expect(getRoute('v1', 'root')).toBe('/v1');
			expect(getRoute('v2', 'root')).toBe('/v2');
		});
		it('should get / for root route', () => {
			expect(getRoute('v1', 'v1')).toBe('/');
		});
		it('should get "" for undefined route', () => {
			expect(getRoute()).toBeUndefined();
		});

	});
});
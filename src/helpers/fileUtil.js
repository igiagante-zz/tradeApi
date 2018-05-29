const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// Promisify exists function using a wrapper because of this issue
// https://github.com/petkaantonov/bluebird/issues/418
const existsAsync = Promise.promisify((path, exists2callback) => {
  fs.exists(path, (exists) => { exists2callback(null, exists); });
});

/**
 * Compare two file name from two paths
 * @param {String} pathOne
 * @param {String} pathTwo
 */
const compareFilenameFromPath = (pathOne, pathTwo) => {
  const getFileNameFromPath = (path) => {
    const list = path.split('/');
    return list[list.length - 1];
  };

  const filenameOne = getFileNameFromPath(pathOne);
  const filenameTwo = getFileNameFromPath(pathTwo);

  return filenameOne === filenameTwo;
};

module.exports = Object.assign({}, { existsAsync, compareFilenameFromPath });

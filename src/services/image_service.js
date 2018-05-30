const Promise = require('bluebird');
const imageMagick = Promise.promisifyAll(require('imagemagick'));
const fs = Promise.promisifyAll(require('fs'));
const fileUtil = require('../helpers/fileUtil');

const pathImagesUploaded = `${process.cwd()}/public/images/uploads`;

/**
 * Create directories images if they dont exist
 * @param {String} userFolder - Place where the user will have his images
* @return {Object} - Contains fullsize and thumb image folder paths
*/
const createDirectories = (userFolder) => {
  const createImageDirectory = folderName => fileUtil.existsAsync(folderName)
    .then(exists => (!exists ? fs.mkdirAsync(folderName) : Promise.resolve()))
    .catch((error) => {
      console.log(` mkdir error : ${error}`);
      Promise.reject(error);
    });

  // create user image folder
  const userImagesDirectory = `${pathImagesUploaded}/${userFolder}`;
  const createUserImageFolder = createImageDirectory(userImagesDirectory);

  // create fullsize and thumb image folders
  const fullsizeFolderPath = `${userImagesDirectory}/fullsize/`;
  const thumbFolderPath = `${userImagesDirectory}/thumb/`;

  const createFullsizeImageDirectory = createImageDirectory(fullsizeFolderPath);
  const createThumbImageDirectory = createImageDirectory(thumbFolderPath);

  return createUserImageFolder
    .then(() => Promise.all([createFullsizeImageDirectory, createThumbImageDirectory]))
    .then(() => Promise.resolve({ fullsizeFolderPath, thumbFolderPath }));
};

/**
* Save fullsize image. If the param resize is true, the image will be resized and saved
* at the folder thumb.
* @param {Object}
* @return {Promise<>}
*/
const saveImage = (image, userFolders) => {
  // concat folder with file orginal name
  const fullsizeImagePath = `${userFolders.fullsizeFolderPath}${image.originalname}`;
  const thumbImagePath = `${userFolders.thumbFolderPath}${image.originalname}`;
  const filename = fullsizeImagePath.replace(/"/g, "'");

  return Promise.resolve()
    .then(() => {
      console.log(' Rename  Filename ... ');
      // Sometimes it appears a weird behaviour trying to call fs.exits
      if (fileUtil.compareFilenameFromPath(image.path, fullsizeImagePath)) {
        return Promise.resolve();
      }
      return fs.renameAsync(image.path, fullsizeImagePath);
    })
    .then(() => {
      console.log(' Write  Image File  ... ');
      return fs.writeFileAsync(filename, image.file);
    })
    .then(() => {
      console.log(' Resize  Image File  ... ');
        return imageMagick.resizeAsync({ srcPath: fullsizeImagePath, dstPath: thumbImagePath, width: 400 }); // eslint-disable-line
    });
};

/**
* Save a list of images
* @param {String} folderName - The folder name.
* @param {Array<Image>} image - List of images
* @return {Promise<>}
*/
const saveImages = (foldername, images) => createDirectories(foldername)
  .then((result) => {
    console.log(' Create Directories ... ');
    return Promise.resolve(result);
  })
  .then((userFolders) => {
    console.log(' Save several images ... ');
    return Promise.all(images.map(image => saveImage(image, userFolders)));
  });

module.exports = Object.assign({}, { saveImages });


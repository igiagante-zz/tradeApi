const Promise = require('bluebird');
const imageMagick = Promise.promisifyAll(require('imagemagick'));
const fs = Promise.promisifyAll(require('fs'));
const fileUtil = require('../helpers/fileUtil');

const Image = require('../models/image');

const debug = require('debug')('tradeApi:ImageService');

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
      debug(` mkdir error : ${error}`);
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
* Concat user folder name with the original image name to create the image's path
* @param {String} foldername - The folder where the user will have saved his images
* @param {String} originalname - The original image name
* @return {Object} {fullsizeImagePath, thumbImagePath}
*/
const concactFolderWithOriginalImageName = (foldername, originalname) => {
  const fullsizeImagePath = `${pathImagesUploaded}/${foldername}/fullsize/${originalname}`.replace(/"/g, "'");
  const thumbImagePath = `${pathImagesUploaded}/${foldername}/thumb/${originalname}`.replace(/"/g, "'");

  return Object.assign({}, { fullsizeImagePath, thumbImagePath });
};

/**
* Save fullsize image. If the param resize is true, the image will be resized and saved
* at the folder thumb.
* @param {File} image
* @param {String} userFolder - The folder where the user will have saved his images
* @return {Promise<>}
*/
const saveImage = (image, userFolders) => {
  // add asserts for parameter validations

  // concat folder with file orginal name
  const { fullsizeImagePath, thumbImagePath } =
    concactFolderWithOriginalImageName(userFolders, image.originalname);

  return Promise.resolve()
    .then(() => {
      debug(' Rename  Filename ... ');
      // Sometimes it appears a weird behaviour trying to call fs.exits
      if (fileUtil.compareFilenameFromPath(image.path, fullsizeImagePath)) {
        return Promise.resolve();
      }
      return fs.renameAsync(image.path, fullsizeImagePath);
    })
    .then(() => {
      debug(' Write  Image File  ... ');
      return fs.writeFileAsync(fullsizeImagePath, image.file);
    })
    .then(() => {
      debug(' Resize  Image File  ... ');
      return imageMagick.resizeAsync({ srcPath: fullsizeImagePath, dstPath: thumbImagePath, width: 400 }); // eslint-disable-line
    });
};

/**
* Save a list of images
* @param {String} folderName - The folder name
* @param {Array<Image>} image - List of images
* @return {Promise<>}
*/
const saveImages = (foldername, images) => createDirectories(foldername)
  .then((result) => {
    debug(' Create Directories ... ');
    return Promise.resolve(result);
  })
  .then(() => {
    debug(' Save several images ... ');
    return Promise.all(images.map(image => saveImage(image, foldername)));
  });

/**
* Convert image files into Image Models
* @param {String} folderName - The folder name
* @param {Array<ImageModel>} image - List of image models
* @return {Promise<>}
*/
const convertImageFilesToImageModel = function (folderName, images) {
  const convertImageToModel = function (image) {
    // concat folder with file orginal name
    const { fullsizeImagePath, thumbImagePath } =
      concactFolderWithOriginalImageName(folderName, image.originalname);

    return new Image({
      file: image.file,
      url: fullsizeImagePath,
      thumbnailUrl: thumbImagePath,
      name: image.originalname,
      mimetype: image.mimetype,
      size: image.size,
    });
  };

  return Promise.all(images.map(image => convertImageToModel(image)));
};

module.exports = Object.assign({}, {
  saveImages,
  convertImageFilesToImageModel,
});


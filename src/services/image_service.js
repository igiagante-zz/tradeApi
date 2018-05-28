const Promise = require('bluebird');
const imageMagick = Promise.promisifyAll(require('imagemagick'));
const fs = Promise.promisifyAll(require("fs"));
const im = require('imagemagick');

/**
 * Create an object with methods to obtain the images path (fullzise & thumb)
 * @param {String} folderName - The folder name.
 * @param {Object} image - The image object.
 * @returns {Object} - Contains path to fullsize and thumb images folder
 */
const imageObject = (folderToSaveImage, image) => {

    //throw error if image does not have an originalname

    const pathImagesUploaded = process.cwd() + '/public/images/uploads';

    const fullsizeFolderPath = `${pathImagesUploaded}/fullsize/`;
    const thumbFolderPath = `${pathImagesUploaded}/thumb/`;

    const fullsizeImagePath = fullsizeFolderPath.concat(image.originalname);
    const thumbImagePath = thumbFolderPath.concat(image.originalname);

    /**
    * Create directories images if they dont exist
    */
    let createDirectories = () => {

      // Promisify exists function using a wrapper because of this issue 
      // https://github.com/petkaantonov/bluebird/issues/418
      fs.existsAsync = Promise.promisify
      (function exists2(path, exists2callback) {
          fs.exists(path, function callbackWrapper(exists) { exists2callback(null, exists); });
      });

      let createImageDirectory = (folderName) => {
        return fs.existsAsync(folderName)
        .then(exists => !exists ? fs.mkdirAsync(folderName) : Promise.resolve())
        .catch(error => Promise.reject(error));
      };

      let createFullsizeImageDirectory = createImageDirectory(fullsizeFolderPath);
      let createThumbImageDirectory = createImageDirectory(thumbFolderPath);

      return Promise.all([createFullsizeImageDirectory, createThumbImageDirectory]);
    };

    /**
    * Save fullsize image. If the param resize is true, the image will be resize and save
    * at the folder thumb.
    * @param {Boolean} resize - Indicate if the image should be resize or not
    * @return {Promise<>}
    */
    let saveImage = (resize = true) => {

      //the file descriptor works only with single quote -- I do not know why
      const filename = fullsizeImagePath.replace(/"/g, "'");

      return createDirectories()
        .then(() => {
          console.log(' Create Directories ... ');
          return Promise.resolve();
        })
        .then(() => {
          console.log(' Rename  Filename ... ');
          return fs.renameAsync(image.path, fullsizeImagePath);
        })
        .then(() => {
          console.log(' Write  Image File  ... ');
          return fs.writeFileAsync(filename, image.file);
        })
        .then(() => {
          console.log(' Resize  Image File  ... ');
          return imageMagick.resizeAsync({ srcPath: fullsizeImagePath, dstPath: thumbImagePath, width: 400 });
        });
    }

    return Object.assign({}, { 
      fullsizeFolderPath,
      thumbFolderPath,
      fullsizeImagePath, 
      thumbImagePath, 
      saveImage
    });
};

module.exports = imageObject;



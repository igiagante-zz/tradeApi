const Promise = require('bluebird');
const imageMagick = Promise.promisifyAll(require('imagemagick'));
const fs = Promise.promisifyAll(require("fs"));
const im = require('imagemagick');
const fileUtil = require('../helpers/fileUtil');

Promise.config({
  // Enable warnings
  warnings: true,
  // Enable long stack traces
  longStackTraces: true,
  // Enable cancellation
  cancellation: true,
  // Enable monitoring
  monitoring: true
});

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

      let createImageDirectory = (folderName) => {
        return fileUtil.existsAsync(folderName)
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
          // Sometimes it appears a weird behaviour trying to call fs.exits
          if(fileUtil.compareFilenameFromPath(image.path, fullsizeImagePath)) {
            return Promise.resolve();
          }
          return fs.renameAsync(image.path, fullsizeImagePath);
        })
        .then(() => {
          console.log(' Write  Image File  ... ');
          return fs.writeFileAsync(filename, image.file);
        })
        .then(() => {
          // Research how promises and functions scope are related
          // Without the following statement, resize results to be undefined
          const imageShouldBeResize = resize;
          if(imageShouldBeResize) {
            console.log(' Resize  Image File  ... ');
            return imageMagick.resizeAsync({ srcPath: fullsizeImagePath, dstPath: thumbImagePath, width: 400 });
          }
          return Promise.resolve();
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



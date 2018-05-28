const Promise = require('bluebird');
const expect = require('chai').expect;
const imageService = require('../../src/services/image_service');

const fs = Promise.promisifyAll(require("fs"));
const rimrafAsync = Promise.promisify(require('rimraf'));

const rimraf = require('rimraf');

fs.existsAsync = Promise.promisify
(function exists2(path, exists2callback) {
    fs.exists(path, function callbackWrapper(exists) { exists2callback(null, exists); });
 });

describe('User tests', () => {

    it('create image folders', async () => {

        const originalname = 'conteo_contracting.png';

        const imagePath = process.cwd() + `/public/images/uploads/${originalname}`;

        try {
            const imageFile = await fs.readFileAsync(imagePath);

            let image = {
                file: imageFile,
                path: imagePath,
                originalname: originalname
            };

            const imageObject = imageService('chart', image);
            const test = imageObject.createDirectories();

        } catch (error) {
            // then
            console.log(error);
        }
    });
    
    it('create image object', async () => {

        const originalname = 'count_contracting.png';

        const imageFullsizePath = process.cwd() + `/public/images/uploads/fullsize/${originalname}`;
        const imageThumbPath = process.cwd() + `/public/images/uploads/thumb/${originalname}`;

        try {
            // prepare

            // OS is linking the file instead of creating a new one. Trying this workaround, but
            // it's not working.
            // TODO -  figure out how to create a new file without linking
            const imagePath = process.cwd() + `/test/images/${originalname}`;
            const copyImagePath = process.cwd() + `/public/images/uploads/${originalname}`;
            
            // take image from test folder and move it to /public/images/uploads/
            await fs.copyFileAsync(imagePath, copyImagePath);
            
            const imageFile = await fs.readFileAsync(copyImagePath);

            let image = {
                file: imageFile,
                path: imagePath,
                originalname: originalname
            };

            const imageObject = imageService('chart', image);

            // when 
            await imageObject.saveImage();

            // expect
            fs.existsAsync(imageFullsizePath).then( (result) => {
                expect(result).to.be.true;
              });

            fs.existsAsync(imageThumbPath).then( (result) => {
                expect(result).to.be.true;
            });

            // restart config files to run the test again
            const dir = process.cwd() + `/public/images/uploads/*`;
            await rimrafAsync(dir);

        } catch (error) {
            console.log(error);
        }
    });

});
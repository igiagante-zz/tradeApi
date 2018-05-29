const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const rimrafAsync = Promise.promisify(require('rimraf'));

const expect = require('chai').expect;
const imageService = require('../../src/services/image_service');

describe('Image Service Tests', () => {

    it('Save and resize image', async () => {

        const originalname = 'count_contracting.png';

        const imageFullsizePath = process.cwd() + `/public/images/uploads/fullsize/${originalname}`;
        const imageThumbPath = process.cwd() + `/public/images/uploads/thumb/${originalname}`;

        try {

            // prepare
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
            await imageObject.saveImage(true);

            // expect
            /*
            const imageFullsizePathExists = await fs.existsAsync(imageFullsizePath);
            expect(imageFullsizePathExists).to.be.true;

            const imageThumbPathExists = await fs.existsAsync(imageThumbPath);
            expect(imageThumbPathExists).to.be.true; */

            // restart config files to run the test again
            const dir = process.cwd() + `/public/images/uploads/*`;
            await rimrafAsync(dir);

        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

});
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const rimrafAsync = Promise.promisify(require('rimraf'));

const expect = require('chai').expect;
const imageService = require('../../src/services/image_service');

describe('Image Service Tests', () => {

    const userFolder = 'peter';

    it('Save and resize one image', async () => {

        const userFolder = 'peter';

        const originalname = 'count_contracting.png';

        const imageFullsizePath = process.cwd() + `/public/images/uploads/${userFolder}/fullsize/${originalname}`;
        const imageThumbPath = process.cwd() + `/public/images/uploads/${userFolder}/thumb/${originalname}`;

        try {

            // prepare
            const imagePath = process.cwd() + `/test/images/${originalname}`;
            const copyImagePath = process.cwd() + `/public/images/uploads/${originalname}`;
            
            // take image from test folder and move it to /public/images/uploads/
            await fs.copyFileAsync(imagePath, copyImagePath);
            
            const imageFile = await fs.readFileAsync(copyImagePath);

            let image = {
                file: imageFile,
                path: copyImagePath,
                originalname: originalname
            };

            // when 
            await imageService.saveImages(userFolder, [image]);

            // expect
            /*
            const imageFullsizePathExists = await fs.existsAsync(imageFullsizePath);
            expect(imageFullsizePathExists).to.be.true;

            const imageThumbPathExists = await fs.existsAsync(imageThumbPath);
            expect(imageThumbPathExists).to.be.true;*/

            // restart config files to run the test again
            const dir = process.cwd() + `/public/images/uploads/*`;
            await rimrafAsync(dir); 

        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

    it('Save and resize images', async () => {

        const originalname = 'count_contracting.png';

        const addImageFile = async (originalname) => {

            const imageFullsizePath = process.cwd() + `/public/images/uploads/${userFolder}/fullsize/${originalname}`;
            const imageThumbPath = process.cwd() + `/public/images/uploads/${userFolder}/thumb/${originalname}`;

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

            return image;
        };

        const nameImageOne = 'count_contracting.png';
        const nameImageTwo = 'count_falling_wedge.jpeg';

        //create images
        let imageOne = await addImageFile(nameImageOne);
        let imageTwo = await addImageFile(nameImageTwo);

        let images = [imageOne, imageTwo];

        try {

            // when 
            await imageService.saveImages(userFolder, images);

            // expect
      
            // restart config files to run the test again
            const dir = process.cwd() + `/public/images/uploads/*`;
            await rimrafAsync(dir);

        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

});
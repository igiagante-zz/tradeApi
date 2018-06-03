const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const rimrafAsync = Promise.promisify(require('rimraf'));

const expect = require('chai').expect;
const assert = require('chai').assert;
const imageService = require('../../src/services/image_service');

describe('Image Service Tests', () => {

    after(() => {

        try {
            // restart config files to run the test again
            const dir = process.cwd() + `/public/images/uploads/*`;
            return rimrafAsync(dir);
        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

    /**
     * Helper function used to add one or more images for tests
     * @param {String} folderName - The name of the folder where images will be saved
     * @param {String} originalname - Image Name
     */
    const addImageFile = async (folderName, originalname) => {

        const imageFullsizePath = process.cwd() + `/public/images/uploads/${folderName}/fullsize/${originalname}`;
        const imageThumbPath = process.cwd() + `/public/images/uploads/${folderName}/thumb/${originalname}`;

        const imagePath = process.cwd() + `/test/images/${originalname}`;
        const copyImagePath = process.cwd() + `/public/images/uploads/${originalname}`;

        // take image from test folder and move it to /public/images/uploads/
        await fs.copyFileAsync(imagePath, copyImagePath);

        const imageFile = await fs.readFileAsync(copyImagePath);

        let image = {
            filename: '8913bfadsiofafnsdfasdr3',
            mimetype: 'image/png',
            size: 247034,
            file: imageFile,
            path: imagePath,
            fullsizePath: imageFullsizePath,
            thumbPath: imageThumbPath,
            originalname: originalname,
        };

        return image;
    };

    const userFolder = 'peter';

    it('Save and resize one image', async () => {

        try {

        const originalname = 'count_contracting.png';

        const image = await addImageFile(userFolder, originalname);

            // when 
            await imageService.saveImages(userFolder, [image]);

            // expect
            fs.exists(image.fullsizePath, (exists) => {
                expect(exists).to.be.true;
            });

            fs.exists(image.thumbPath, (exists) => {
                expect(exists).to.be.true;
            });

        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

    it('Save and resize images', async () => {

        const nameImageOne = 'count_contracting.png';
        const nameImageTwo = 'count_falling_wedge.jpeg';

        //create images
        let imageOne = await addImageFile(userFolder, nameImageOne);
        let imageTwo = await addImageFile(userFolder, nameImageTwo);

        let images = [imageOne, imageTwo];

        try {

            // when 
            await imageService.saveImages(userFolder, images);

            // expect
            fs.exists(imageOne.fullsizePath, (exists) => {
                expect(exists).to.be.true;
            });

            fs.exists(imageOne.thumbPath, (exists) => {
                expect(exists).to.be.true;
            });

            fs.exists(imageTwo.fullsizePath, (exists) => {
                expect(exists).to.be.true;
            });

            fs.exists(imageTwo.thumbPath, (exists) => {
                expect(exists).to.be.true;
            });
            
        } catch (error) {
            console.log(error);
            console.log(error.stack);
        } finally {

        }
    });

    it('Convert image files to image models', async () => {

        try {

            const nameImageOne = 'count_contracting.png';
            const nameImageTwo = 'count_falling_wedge.jpeg';

            //create images
            let imageOne = await addImageFile(userFolder, nameImageOne);
            let imageTwo = await addImageFile(userFolder, nameImageTwo);

            let images = [imageOne, imageTwo];

            // when 
            const imagesModel = await imageService.convertImageFilesToImageModel(userFolder, images);

            assert.isArray(imagesModel, 'Image models array created');
            assert.lengthOf(imagesModel, 2, 'array has length of 2');


        } catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    });

});
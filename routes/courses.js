const express = require('express');

const router = express.Router();

const courseController = require('../controllers/course');
const { body } = require('express-validator');

router.get('/', courseController.getHome);
router.get('/courses', courseController.getCourses);
router.get('/add-course', courseController.getAddCourse);
router.post('/add-course', 
    [
        body('title').isLength({min: 5}).trim(),
        body('session').custom((value, req) => {
            if (value < Date.now()) {
                throw new Error('Course session is expired!');
            }
            return true;
        })
    ],
    courseController.postAddCourse);
router.get('/courses/:courseId', courseController.getViewCourse);

module.exports = router;

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const { body } = require('express-validator/check');
const Course = require('../models/course');
const teacher = require('../models/teacher');

router.get('/courses-dash', adminController.getCoursesDash);
router.get('/add-course', adminController.getAddCourse);
router.post('/add-course',
    [
        body('title').trim().isLength({min: 2}),
        // body('price').custom((value, {req}) => {
        //     if (value <= 0) {
        //         throw new Error('Price is very low!');
        //     }
        // })
    ],
    adminController.postAddCourse);
router.get('/teachers-dash', adminController.getTeachersDash);
router.get('/add-teacher', adminController.getAddTeacher);
router.post('/add-teacher',[
    body('name').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Please enter a valid email.').custom(value => {
        return teacher.findOne({email: value}).then(user => {
            if (user) {
                return Promise.reject('Email is already registered.');
            }
        })
    }),
    body('password', 'Please enter a password with atleast 5 characters')
        .isLength({min: 5}).trim(),
], adminController.postAddTeacher);



module.exports = router;

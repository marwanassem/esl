const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const { body } = require('express-validator/check');
const isAdmin = require('../middleware/is_admin');
const Course = require('../models/course');
const teacher = require('../models/teacher');

router.get('/courses-dash', isAdmin, adminController.getCoursesDash);
router.get('/add-course', isAdmin, adminController.getAddCourse);
router.post('/add-course',
    [
        body('title').trim().isLength({min: 2}),
    ],
    adminController.postAddCourse);
router.get('/teachers-dash', isAdmin, adminController.getTeachersDash);
router.get('/add-teacher', isAdmin, adminController.getAddTeacher);
router.post('/add-teacher', isAdmin, [
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

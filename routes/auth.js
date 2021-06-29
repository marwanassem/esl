const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const { body } = require('express-validator/check');
const Student = require('../models/student');

router.get('/signup');
router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(value => {
                return Student.findOne({email: value}).then(user => {
                    if (user) {
                        return Promise.reject('E-mail is already registered.');
                    }
                })
            }),
            body('password', 'Please enter a password with atleast 5 characters.')
            .isLength({ min: 5})
            .trim(),

        body('confirmPassword')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords must match!');
                }
                return true;
            }),

        body('name')
            .trim()
            .not().isEmpty()
    ],
    authController.postSignup
);

module.exports = router;
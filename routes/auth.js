const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const { body } = require('express-validator');
const Student = require('../models/student');

router.get('/signup', authController.getSignup);
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
            .not().isEmpty(),

        body('statusPicker').custom((value, {reg}) => {
            if (value === 0) {
                throw new Error("Please select your current status.");
            }
            return true;
        })
    ],
    authController.postSignup
);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);


module.exports = router;
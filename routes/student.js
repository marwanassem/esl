const express = require('express');
const router = express.Router();

const Student = require('../models/student');
const Course = require('../models/course');
const studentController = require('../controllers/student');
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is_auth');

router.get('/student/:studentId', studentController.getProfile);
router.post('/courses/:courseId/enroll', isAuth, studentController.postEnroll);

module.exports = router;

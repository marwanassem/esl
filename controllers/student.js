const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');
const student = require('../models/student');

exports.getProfile = (req, res, next) => {
    const studentId = req.params.studentId;
    Student.findById(studentId).populate('courses').then(student => {
        if (!student) {
            return res.render('student/profile', {
                pageTitle: 'Profile Info'
            });
        }
        return res.render('student/profile', {
            student: student,
            pageTitle: 'Profile Info',
            user: req.user
        });
    })
    .catch(err => console.log(err));
};

exports.postEnroll = (req, res, next) => {
    const student = req.user;
    const courseId = req.params.courseId;
    console.log(courseId);
    Course.findById(courseId).then(course => {
        if (!course) {
            return res.render('404');
        }
        for(var i = 0; i < student.courses.length; i++) {
            if (student.courses[i] == courseId) {
                var err = new Error('You already enrolled in this course.');
                return next(err);
            }
        }
        student.courses.push(course);
        course.students.push(student);
        course.save();
        console.log(course.students.length);
        return student.save();
    })
    .then(result => {
        return res.redirect('/student/'+req.user._id);
    })
    .catch(err => console.log(err));
};


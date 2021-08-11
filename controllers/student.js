const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');
const student = require('../models/student');

exports.getProfile = (req, res, next) => {
    const studentId = req.params.studentId;
    let studentCourses = [];
    Student.findById(studentId).then(student => {
        if (!student) {
            return res.render('student/profile', {
                pageTitle: 'Profile Info'
            });
        }
        let coursesArr = [...student.courses];
        for(let i = 0; i < coursesArr.length; i++) {
            Course.findById(coursesArr[i]).then(course => {
                var obj = {};
                obj[course.name] = [...course];
                studentCourses.push(obj);
            }).catch(err => console.log(err));
        }
    })
    .then(result => {
        console.log(studentCourses);
        return res.render('student/profile', {
            studentCourses: studentCourses,
            pageTitle: 'Profile Info',
            user: req.user
        });
    })
    .catch(err => console.log(err));
};

exports.postEnroll = (req, res, next) => {
    const student = req.user;
    const courseId = req.params.courseId;
    Course.findById(courseId).then(course => {
        if (!course) {
            return res.render('404');
        }
        console.log(req.user);
        student.courses.push(course);
        course.students.push(student);
        course.save();
        return student.save();
    })
    .then(result => {
        return res.redirect('/student/'+req.user._id);
    })
    .catch(err => console.log(err));
};


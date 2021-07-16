const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Teacher = require('../models/teacher');
const Course = require('../models/course');

exports.getCoursesDash = (req, res, next) => {
    Course.find().populate('teacherId').then(courses => {
        console.log(courses);
        return res.render('admin/courses-dash', {
            courses: courses,
            pageTitle: 'Courses Dashboard'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getAddCourse = (req, res, next) => {
    Teacher.find().then(teachers => {
        return res.render('admin/edit-courses', {
            instructors: teachers,
            editing: false,
            hasError: false,
            errorMessage: null,
            pageTitle: 'Add a new Course'
        });
    }).catch(err => console.log(err))
};

exports.postAddCourse = (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        Teacher.find().then(teachers =>{
            return res.render('admin/edit-courses', {
                instructors: teachers,
                editing: false,
                hasError: false,
                errorMessage: errors.array()[0],
                pageTitle: 'Add a new Course'
            }); 
        });
    }
    const title = req.body.title;
    const price = parseInt(req.body.price);
    const description = req.body.description;
    const session = req.body.session;
    let instructorMail = req.body.selectpicker;
    let instructor;
    Teacher.findOne({email: instructorMail}).then(teacher => {
        instructor = teacher._id;
    })
    .then(result => { 
        const course = new Course({
            name: title,
            session: session,
            description: description,
            teacherId: instructor,
            pricePerSession: parseInt(req.body.price), 
        });
        return course.save().then(result => {
             res.redirect('courses-dash');
        });
    }).catch(err => console.log(err));
}

exports.getTeachersDash = (req, res, next) => {
    Teacher.find().populate('courses').then(teachers => {
        console.log(teachers);
        return res.render('admin/teachers-dash', {
            teachers: teachers,
            pageTitle: 'Teachers Dashboard'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getAddTeacher = (req, res, next) => {
    return res.render('admin/add-teacher', {
        errorMessage: null,
        pageTitle: 'New Teacher to the fam.',
        path: 'add-teacher',
    });
}

exports.postAddTeacher = (req, res, next) => {
    const name = req.body.name;
    console.log('req: %j' , req.body);
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.render('admin/add-teacher', {
            errorMessage: errors.array()[0],
            pageTitle: 'New Teacher to the fam.',
            path: 'add-teacher',
        });
    }
    console.log('-----------------------------');
    console.log(req);
    
    bcrypt.hash(password, 12)   
        .then(hashedPass => {
            const teacher = new Teacher({
                name: name,
                email: email,
                password: hashedPass,
            });
            return teacher.save();
        })
        .then(result => {
            res.redirect('/teachers-dash');
        })
        .catch(err => console.log(err));
}


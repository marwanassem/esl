const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Student = require('../models/student');

exports.getAdminIndex = (req, res, next) => {
    return res.render('admin/admin-index', {
        user: req.session.user
    });
};

exports.getCoursesDash = (req, res, next) => {
    Course.find().populate('teacherId').then(courses => {
        return res.render('admin/courses-dash', {
            courses: courses,
            pageTitle: 'Courses Dashboard',
            user: req.session.user
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
            pageTitle: 'Add a new Course',
            user: req.session.user
        });
    }).catch(err => console.log(err))
};

exports.postAddCourse = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("IN POST REQ");
        console.log(errors);
        Teacher.find().then(teachers =>{
            return res.render('admin/edit-courses', {
                instructors: teachers,
                editing: false,
                hasError: false,
                errorMessage: errors.array()[0],
                pageTitle: 'Add a new Course',
                user: req.session.user
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
            pricePerSession: price, 
        });
        return course.save().then(result => {
            console.log('Course Added.');
            res.redirect('courses-dash');
        });
    }).catch(err => console.log(err));
}

exports.getTeachersDash = (req, res, next) => {
    Teacher.find().populate('courses').then(teachers => {
        return res.render('admin/teachers-dash', {
            teachers: teachers,
            pageTitle: 'Teachers Dashboard',
            user: req.session.user
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
        user: req.session.user
    });
}

exports.postAddTeacher = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.render('admin/add-teacher', {
            errorMessage: errors.array()[0],
            pageTitle: 'New Teacher to the fam.',
            path: 'add-teacher',
            user: req.session.user
        });
    }    
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
};

exports.getStudentsDash = (req, res, next) => {
    // filter students by (private, school or center)
    // render the list of students
    // add an option to save an excel sheet with all of their info
    return res.render('admin/students-dash', {
        user: req.session.user,
        searchResult: false
    });
};

exports.postStudentsSearch = (req, res, next) => {
    Student.find({status: req.body.searchChoice}).then(students => {
        if (!students) {
            return res.render('admin/students-dash', {
                user: req.session.user,
                searchResult: false
            });
        }
        return res.render('admin/students-dash', {
            user: req.session.user,
            searchResult: true,
            students: students
        });
    }).catch(err => console.log(err))
};


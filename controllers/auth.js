const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Student = require('../models/student');

exports.getSignup = (req, res, next) => {
    return res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        }
    )
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPass;

    // if (req.body.chckUser == "true") {
    //     const status = req.body.status;
    //     const parentMail = req.body.parentMail;
    // }

    

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign up',
        })
    }
    
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const student = new Student({
                name: name,
                email: email,
                status: status,
                password: hashedPassword,
                parentMail: parentMail,
                courses: []
            });
            return student.save();
        })
        .then(result => {
            res.redirect('/login');
            // SEND A CONFIRMATION MAIL
        })
        .catch(err => console.log(err));
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login', 
        path: '/login',
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
        });
    }

    Student.findOne({email: email})
        .then(student => {
            if (!student) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                });
        }
        bcrypt.compare(password, student.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = student;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
            });
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/login');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

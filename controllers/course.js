const Course = require('../models/course');
const Teacher = require('../models/teacher');


exports.getHome = (req, res, next) => {
    let username = null;
    if (req.session.isLoggedIn) {
        username = req.session.user.name
    }
    Course.find().then(courses => {
        return res.render('index', {
            pageTitle: 'ESL - Online Platform',
            courses: courses,
            isAuthenticated: req.session.isLoggedIn,
            username: username
        });
    }).catch(err => console.log(err));
};

exports.getCourses = (req, res, next) => {
    Course.find().populate('teacherId')
        .then(courses => {
            return res.render('course/courses', {
                path: '/courses',
                pageTitle: 'Courses',
                courses: courses,
                isAuthenticated: req.session.isLoggedIn,
            });
        }).catch(err => {
            console.log(err);
        });
}

exports.getAddCourse = (req, res, next) => {
    res.render('course/add-course', {
        path: 'add-course',
        pageTitle: 'New Course',
    });
};

exports.postAddCourse = (req, res, next) => {
    //NEED TO CHECK IF THE LOGGED IN USER IS ADMIN.
    
    // if (isAdmin) => proceed 
    // else exit

    const name = req.body.name;
    const session = req.body.session;
    // will be updated
    const teacher = req.body.teacher;
    const price = req.body.price;
    const description = req.body.description;
    let courseInstructor;

    Teacher.findOne({name: teacher})
        .then(teacher => {
            if (teacher) {
                courseInstructor = teacher;
            } else {
                res.render('course/add-course', {
                    path: 'add-course',
                    pageTitle: 'New Course',
                });         
            }
        })
        .catch(err => console.log(err));
    
    const course = new Course ({
        name: name,
        session: session,
        teacher: courseInstructor._id,
        price: price,
        description: description,
        students: []
    });

    course.save()
        .then(result => {
            teacher.courses.push(course);
            return teacher.save();
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getViewCourse = (req, res, next) => {
    // if admin display delete/edit button
    // if student display enroll button
    // else just view the course and its description

    const courseId = req.params.courseId;

    Course.findById(courseId).populate('teacherId')
        .then(course => {
            console.log(course);
            return res.render('course/view-course', {
                pageTitle: 'View Course',
                course: course,
            });
        })
        .catch(err => console.log(err))
}


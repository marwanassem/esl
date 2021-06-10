exports.getCourses = (req, res, next) => {
    return res.render('course/courses', {
        path: '/courses',
        pageTitle: 'Courses',
    });
};
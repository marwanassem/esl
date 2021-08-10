module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        throw new Error('Please Login To Access this Process.');
    }
    next();
};
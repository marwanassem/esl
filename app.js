// installed packages
const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Built-in packages
const path = require('path');

// Project files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/student');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


const MONGODB_URI = 
    "mongodb+srv://Marwan:m_mongodb@cluster0.14k92.mongodb.net/esl?retryWrites=true&w=majority";

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// Middlewares
app.use(body_parser.urlencoded({extended: false}));
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        expires: new Date(Date.now() + 1200000)
    }
}));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user){
        req.session.isLoggedIn = false;
        // return next();
    }
    if (!req.session.isLoggedIn) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user){
            return next();
        }
        if (user.isAdmin) {
            req.session.isAdmin = true;
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
});


// Defining routes
app.use(adminRoutes);
app.use(authRoutes);
app.use(courseRoutes);
app.use(studentRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(result => {
        console.log('Connected');
        app.listen(process.env.PORT || 8000);
    })
    .catch(err => console.log(err));
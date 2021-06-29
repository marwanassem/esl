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
const courseRoutes = require('./routes/courses');
const errorController = require('./controllers/error');

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
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user){
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
app.use(authRoutes);
app.use(courseRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {useNewUrlParse: true, useUnifiedTopology: true})
    .then(result => {
        console.log('Connected');
        app.listen(process.env.PORT || 8000);
    })
    .catch(err => console.log(err));
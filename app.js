// installed packages
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);




const app = express();


const MONGODB_URI = 
    "mongodb+srv://Marwan:m_mongodb@cluster0.14k92.mongodb.net/esl?retryWrites=true&w=majority";


mongoose
    .connect(MONGODB_URI, {useNewUrlParse: true, useUnifiedTopology: true})
    .then(result => {
        console.log('Connected');
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err));
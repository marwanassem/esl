const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const Student = User.discriminator('Student', new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    parentMail: {
        type: String,
        required: true,
        unique: true
    },
}));

module.exports = mongoose.model('Student');

// const studentSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     status: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     parentMail: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     courses: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Course',
//     }],

// });

// module.exports = mongoose.model('Student', studentSchema);
const mongoose = require('mongoose');
const User = require('./user');

const Teacher = User.discriminator('Teacher', new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    }
}));

module.exports = mongoose.model('Teacher');


// const teacherSchema = new Schema({
//     name: {
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
//     courses: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Course',
//     }],
//     isAdmin: {
//         type: Boolean,
//         default: false,
//     }

// });

// module.exports = mongoose.model('Teacher', teacherSchema);
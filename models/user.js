var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  

const baseOptions = {
    discriminatorKey: 'userType',
    collection: 'users'
}

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        unique: true
    },  
    password: { 
        type: String 
    },  
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, baseOptions));

module.exports = mongoose.model('User');


// function baseSchema() {  
//     Schema.apply(this, arguments);  

//     this.add({ 
//         name: { 
//             type: String,
//             required: true 
//         },  
//         email: { 
//             type: String,
//             unique: true
//         },  
//         password: { 
//             type: String 
//         },  
//         courses: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Course'
//         }],
//     });  
// }  

// util.inherits(baseSchema, Schema);
// var userSchema = new baseSchema();

// var studentSchema = new userSchema({
//     parentEmail: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     status: {
//         type: String,
//         require: true
//     }
// });

// var teacherSchema = new userSchema({
//     isAdmin: {
//         type: Boolean,
//         default: false
//     }
// });

// mongoose.model('User', userSchema);
// User.discriminator('Student', studentSchema);
// User.discriminator('Teacher', teacherSchema);


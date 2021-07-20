const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    description: {
        type: String
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    link: {
        type: String
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
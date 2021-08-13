const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    session: {
        type: Date,
        required: true,
    },
    description: {
        type: String
    },
    pricePerSession: {
        type: Number,
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    classroom: {
        type: String,
    },
    assignments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Course', courseSchema);
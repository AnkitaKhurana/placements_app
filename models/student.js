const mongoose = require('mongoose');


//Schema
const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    rollno: {
        type: Number,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    registeredOn: {
        type: Date,
        default: Date.now()
    },
    companiesRegistered: [ {type : mongoose.Schema.Types.ObjectId, ref : 'companies'} ]

});


module.exports = mongoose.model('students',studentSchema);

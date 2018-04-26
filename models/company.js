const mongoose = require('mongoose');


// Schema
const companySchema = mongoose.Schema({

    c_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    studentsRequired: {
        type: Number,
        // required: true
    },
    package: {
        type: Number,
        // required: true
    },
    role: {
        type: String,
    },
    registeredOn: {
        type: Date,
        default: Date.now()
    },
    studentsRegistered: [ {type : mongoose.Schema.Types.ObjectId, ref : 'students'} ]

});


module.exports = mongoose.model('companies',companySchema);

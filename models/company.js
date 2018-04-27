const mongoose = require('mongoose');


// Schema
const companySchema = mongoose.Schema({

    c_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    studentsRequired: {
        type: Number
    },
    package: {
        type: Number
    },
    role: {
        type: String,
    },
    registeredOn: {
        type: Date,
        default: Date.now()
    },
    studentsRegistered: [{type: mongoose.Schema.Types.ObjectId, ref: 'students'}]

});


module.exports = mongoose.model('companies', companySchema);

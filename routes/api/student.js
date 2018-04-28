const route = require('express').Router();
const Student = require('../../models/student');
const Company = require('../../models/company');
const validator = require('validator');
const winston = require('winston');

//Get all Students
route.get('/all', (req, res) => {

    Student.find({}, function (err, records) {
        if (err) {
            winston.log('Error', {
                error: 'Error :'+ err
            });
            return res.status(400).json({
                "error": err,
                "message": "Some Error Occurred"
            });
        }
        res.json(records);
    })
});


//Get one Student
//Sends null incase of no matching roll number
//Sends Json object of matched record incase found
route.get('/:rollno', (req, res) => {

    if (validator.isNumeric('' + req.params.rollno)) {
        Student.findOne({rollno: req.params.rollno}).populate('companies').exec(function (err, record) {
            if (err) {
                winston.log('Error', {
                    error: 'Error :'+ err
                });
                return res.status(400).json({
                    "error": err,
                    "message": "Some Error Occurred"
                });
            }
            res.json(record);
        });
    }
    else {
        winston.log('Warning', {
            error: 'Invalid Roll Number'
        });
        return res.status(400).json({
            "error": "Invalid Roll Number",
            "message": "Invalid Roll Number"
        });
    }
});


//Add New Student with/without companies
route.post('/add', (req, res) => {

    let student = {};
    let st1;

    let array = req.body.companies;
    for (var i = 0, len = array.length; i < len; i++) {
        array[i] = parseInt(array[i], 10);
    }


    let query = {'c_id': {$in: array}};

    if (validator.isEmpty('' + req.body.name) ||
        !validator.isAscii('' + req.body.name) || (req.body.name == null)) {
        winston.log('Warning', {
            error: 'Invalid Name'
        });
        return res.status(400).json({
            "error": "Invalid Name",
            "message": "Invalid Name"
        });
    }
    else {
        student.name = req.body.name;
    }


    if (validator.isEmpty('' + req.body.rollno) ||
        !validator.isAscii('' + req.body.rollno) || (req.body.rollno == null)) {
        winston.log('Warning', {
            error: 'Invalid Roll Number'
        });
        return res.status(400).json({
            "error": "Invalid Roll Number",
            "message": "Invalid Roll Number"
        });
    }
    else {
        student.rollno = req.body.rollno;
    }

    if (!validator.isAscii('' + req.body.department) &&
        req.body.department != null) {
        winston.log('Warning', {
            error: 'Invalid Department'
        });
        return res.status(400).json({
            "error": "Invalid Department",
            "message": "Invalid Department"
        });
    }
    else if (req.body.department != null) {
        student.department = req.body.department;
    }
    else {
        student.department = '';
    }

    if (!validator.isNumeric('' + req.body.cgpa) &&
        req.body.package != null) {
        winston.log('Warning', {
            error: 'Invalid cgpa'
        });
        return res.status(400).json({
            "error": "Invalid cgpa",
            "message": "Invalid cgpa"
        });
    }
    else if (req.body.cgpa != null) {
        student.cgpa = req.body.cgpa;
    }
    else {
        student.cgpa = null;
    }


    Company.find(query, function (err, r) {
        if (err) {
            winston.log('Error', {
                error: 'Error :'+ err
            });
            return res.status(400).json({
                "error": err,
                "message": "Some Error Occurred"
            });
        }

        Student.findOne({rollno: req.body.rollno}, function (err, newstu) {
            if (newstu == null) {

                st1 = new Student({
                    name: student.name,
                    rollno: student.rollno,
                    cgpa: student.cgpa,
                    department: student.department
                }, function (err, record) {
                    if (err) {
                        winston.log('Error', {
                            error: 'Error :'+ err
                        });
                        return res.status(400).json({
                            "error": err,
                            "message": "Some Error Occurred"
                        });
                    }

                });
                for (i in r) {
                    if (r[i] !== null) {
                        st1.companiesRegistered.push(r[i]._id);
                        if (r[i].studentsRegistered.indexOf(st1._id) === -1) {
                            r[i].studentsRegistered.push(st1._id);
                            r[i].save();
                        }
                    }
                }

                st1.save();
                res.json(st1);
            }
            else {
                winston.log('Warning', {
                    error: 'Student Roll Number Already exists'
                });
                return res.status(400).json({
                    "error": "Student Roll Number Already exists",
                    "message": "Student Roll Number exists"
                });
            }
        });
    });

});


//Edit Student Details (with/without companies)
route.put('/edit/:rollno', (req, res) => {


    let query = {rollno: req.params.rollno};
    let update = {};

    if (!validator.isAscii('' + req.body.department) &&
        req.body.department != null) {
        winston.log('Warning', {
            error: 'Invalid Department'
        });
        return res.status(400).json({
            "error": "Invalid Department",
            "message": "Invalid Department"
        });
    }
    else if (req.body.department != null) {
        update.department = req.body.department;
    }


    if (!validator.isAscii('' + req.body.name) &&
        req.body.name != null) {
        winston.log('Warning', {
            error: 'Invalid Name'
        });
        return res.status(400).json({
            "error": "Invalid Name",
            "message": "Invalid Name"
        });
    }
    else if (req.body.name != null) {
        update.name = req.body.name;
    }


    if (!validator.isNumeric('' + req.body.cgpa) &&
        req.body.cgpa != null) {
        winston.log('Warning', {
            error: 'Invalid Name'
        });
        return res.status(400).json({
            "error": "Invalid Name",
            "message": "Invalid Name"
        });
    }
    else if (req.body.name != null) {
        update.cgpa = req.body.cgpa;
    }


    Student.findOneAndUpdate(query, update, {}, function (err, stu) {

        if (err) {
            winston.log('Error', {
                error: 'Error :'+ err
            });
            return res.status(400).json({
                "error": err,
                "message": "Some Error Occurred"
            });
        }
        Company.find({}, function (err, comp) {
            if (err) {
                winston.log('Error', {
                    error: 'Error :'+ err
                });
                return res.status(400).json({
                    "error": err,
                    "message": "Some Error Occurred"
                });
            }
            let array = req.body.companies;
            stu.companiesRegistered = [];
            stu.save();
            for (i in comp) {

                if (comp[i] !== null && typeof array !== 'undefined' && array.length > 0) {

                    let index = comp[i].studentsRegistered.indexOf(stu._id.toString());

                    if (array.indexOf((comp[i].c_id).toString()) === -1) {
                        if (index === -1) {

                        }
                        else {
                            comp[i].studentsRegistered.splice(index, 1);
                            comp[i].save()
                        }

                    }
                    else {
                        if (index === -1) {
                            comp[i].studentsRegistered.push(stu._id);
                            comp[i].save()
                        }
                        stu.companiesRegistered.push(comp[i]._id);
                        stu.save();
                    }
                }
            }

        });
        res.sendStatus(200);
    });

});


//Delete A Student Record
route.delete('/delete/:rollno', (req, res) => {

    if (validator.isNumeric('' + req.params.rollno)) {


        Student.findOne({rollno: req.params.rollno}, function (err, records) {
            if (err) {
                winston.log('Error', {
                    error: 'Error :'+ err
                });
                return res.status(400).json({
                    "error": err,
                    "message": "Some Error Occurred"
                });
            }

            Company.find({}, function (err, comp) {
                if (err) {
                    winston.log('Error', {
                        error: 'Error :'+ err
                    });
                    return res.status(400).json({
                        "error": err,
                        "message": "Some Error Occurred"
                    });
                }
                if (comp !== null && typeof records !== 'undefined' && records !== null)
                    for (i in comp) {

                        var index = comp[i].studentsRegistered.indexOf(records._id.toString());
                        if (index === -1) {

                        }
                        else {
                            comp[i].studentsRegistered.splice(index, 1);
                            comp[i].save();
                        }
                    }
            }).then(records => {
                Student.remove({rollno: req.params.rollno}, function (err, record) {
                    if (err) {
                        winston.log('Error', {
                            error: 'Error :'+ err
                        });
                        return res.status(400).json({
                            "error": err,
                            "message": "Some Error Occurred"
                        });
                    }
                })
            });
        });

        res.sendStatus(200);
    }
    else {
        winston.log('Warning', {
            error: 'Invalid Roll Number'
        });
        return res.status(400).json({
            "error": "Invalid Roll Number",
            "message": "Invalid Roll Number"
        });
    }
});

//Delete All Student Records
route.delete('/deleteAll', (req, res) => {

    Student.remove({}, function (err, record) {
        if (err) {
            winston.log('Error', {
                error: 'Error :'+ err
            });
            return res.status(400).json({
                "error": err,
                "message": "Some Error Occurred"
            });
        }

    });
    Company.find({}, function (err, records) {
        if (err) {
            winston.log('Error', {
                error: 'Error :'+ err
            });
            return res.status(400).json({
                "error": err,
                "message": "Some Error Occurred"
            });
        }
        for (i in records) {
            records[i].studentsRegistered = [];
            records[i].save();
        }

    });
    res.sendStatus(200);

});


//Get all Companies Registered by a particular Student
route.get('/:rollno/companies', (req, res) => {

    if (validator.isNumeric('' + req.params.rollno)) {

        Student.findOne({rollno: req.params.rollno}).populate('companies').exec(function (err, record) {
            if (err) return handleError(err);

            let array = record.companiesRegistered;

            let query = {'_id': {$in: array}};

            Company.find(query, function (err, records) {
                if (err) {
                    winston.log('Error', {
                        error: 'Error :'+ err
                    });
                    return res.status(400).json({
                        "error": err,
                        "message": "Some Error Occurred"
                    });
                }
                res.json(records);
            });
        });
    }
    else {
        winston.log('Warning', {
            error: 'Invalid Roll Number'
        });
        return res.status(400).json({
            "error": "Invalid Roll Number",
            "message": "Invalid Roll Number"
        });
    }

});


//Register/Unregister Companies
route.put('/:rollno/edit/companies', (req, res) => {


    if (validator.isNumeric('' + req.params.rollno)) {

        Student.findOneAndUpdate({rollno: req.params.rollno}, {}, {}, function (err, stu) {

            if (err) {
                winston.log('Error', {
                    error: 'Error :'+ err
                });
                return res.status(400).json({
                    "error": err,
                    "message": "Some Error Occurred"
                });
            }
            Company.find({}, function (err, comp) {
                if (err) {
                    winston.log('Error', {
                        error: 'Error :'+ err
                    });
                    return res.status(400).json({
                        "error": err,
                        "message": "Some Error Occurred"
                    });
                }
                let array = req.body.companies;
                stu.companiesRegistered = [];
                stu.save();
                if (typeof comp !== 'undefined')
                    for (i in comp) {
                        let index = comp[i].studentsRegistered.indexOf(stu._id);

                        if (array.indexOf(comp[i].c_id.toString()) === -1) {
                            if (index === -1) {

                            }
                            else {
                                comp[i].studentsRegistered.splice(index, 1);
                                comp[i].save()
                            }

                        }
                        else {
                            if (index === -1) {
                                comp[i].studentsRegistered.push(stu._id);
                                comp[i].save()
                            }
                            stu.companiesRegistered.push(comp[i]._id);
                            stu.save();
                        }
                    }

            });
            res.json(stu);
        });
    }
    else {
        winston.log('Warning', {
            error: 'Invalid Roll Number'
        });
        return res.status(400).json({
            "error": "Invalid Roll Number",
            "message": "Invalid Roll Number"
        });
    }

});





module.exports = route;
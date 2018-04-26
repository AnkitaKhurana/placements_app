const route = require('express').Router();
const Company = require('../../models/company');
const Student = require('../../models/student');
const validator = require('validator');
const winston = require('winston');


// Get all company objects
route.get('/all', (req, res) => {

    Company.find({},function(err , records)
    {
        if (err) {
            throw err;
        }
        res.json(records);
    })
});

// Get one Company
// Sends null incase of no matching Company Id
//  Sends Json object of matched record incase found
route.get('/:c_id', (req, res) => {


    if(validator.isNumeric(''+req.params.c_id))
    {
        Company.findOne({c_id: req.params.c_id}, function (err, record) {
            if (err) {
                throw err;
            }
            res.json(record);
        });
    }
    else
    {
        winston.log('Warning', {
            error: 'Invalid Company ID'
        });
        return res.status(400).json({
            "error": "Invalid Company ID",
            "message": "Invalid Company ID"
        });
    }

});

// Register New Company
route.post('/add',(req,res)=>{

    let comp = {};

    if(validator.isEmpty(''+req.body.name) ||
        !validator.isAscii(''+req.body.name) || (req.body.name == null)) {
        winston.log('Warning', {
            error: 'Invalid Name'
        });
        return res.status(400).json({
            "error": "Invalid Name",
            "message": "Invalid Name"
        });
    }
    else {
        comp.name = req.body.name;
    }

    if(validator.isEmpty(''+req.body.c_id) ||
        !validator.isNumeric(''+req.body.c_id) || (req.body.c_id == null)) {
        winston.log('Warning', {
            error: 'Invalid c_id'
        });
        return res.status(400).json({
            "error": "Invalid Company Id",
            "message": "Invalid Company Id"
        });
    }
    else {
        comp.c_id = req.body.c_id;
    }


    if(!validator.isAscii(''+req.body.role) &&
        req.body.role!=null) {
        winston.log('Warning', {
            error: 'Invalid Role'
        });
        return res.status(400).json({
            "error": "Invalid Role",
            "message": "Invalid Role"
        });
    }
    else {
        comp.role = req.body.role;
    }


    if(!validator.isNumeric(''+req.body.package)&&
        req.body.package!=null) {
        winston.log('Warning', {
            error: 'Invalid Package'
        });
        return res.status(400).json({
            "error": "Invalid Package",
            "message": "Invalid Package"
        });
    }
    else {
        comp.package = req.body.package;
    }


    if(!validator.isNumeric(''+req.body.studentsRequired)&&
        req.body.studentsRequired!=null) {
        winston.log('Warning', {
            error: 'Invalid Package'
        });
        return res.status(400).json({
            "error": "Invalid Package",
            "message": "Invalid Package"
        });
    }
    else {
        comp.studentsRequired = req.body.studentsRequired;
    }


    Company.findOne({c_id:req.body.c_id},function(err,r) {
            if (r == null) {
                Company.create(comp, function (err, record) {
                    if (err) {
                        throw err;
                    }
                    res.json(record);
                });
            }
            else {
                winston.log('Warning', {
                    error: 'Company ID Already exists'
                });
                return res.status(400).json({
                    "error": "Company ID Already exists",
                    "message": "Company ID Already exists"
                });
            }
    });


});


// Edit Company Details
route.put('/edit/:c_id',(req,res)=>{


    if(validator.isNumeric(''+req.params.c_id)) {
        var query = {c_id: req.params.c_id};
        var update = {};


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


        if (!validator.isAscii('' + req.body.role) &&
            req.body.role != null) {
            winston.log('Warning', {
                error: 'Invalid Role'
            });
            return res.status(400).json({
                "error": "Invalid Role",
                "message": "Invalid Role"
            });
        }
        else if (req.body.role != null) {
            update.role = req.body.role;
        }


        if (!validator.isNumeric('' + req.body.package) &&
            req.body.package != null) {
            winston.log('Warning', {
                error: 'Invalid Package'
            });
            return res.status(400).json({
                "error": "Invalid Package",
                "message": "Invalid Package"
            });
        }
        else if (req.body.package != null) {
            update.package = req.body.package;
        }


        if (!validator.isNumeric('' + req.body.studentsRequired) &&
            req.body.studentsRequired != null) {
            winston.log('Warning', {
                error: 'Invalid Number Of Students Required'
            });
            return res.status(400).json({
                "error": "Invalid Number Of Students Required",
                "message": "Invalid Number Of Students Required"
            });
        }
        else if (req.body.studentsRequired != null) {
            update.studentsRequired = req.body.studentsRequired;
        }

        Company.findOneAndUpdate(query, update, {}, function (err, record) {
            if (err) {
                throw err;
            }
        });
        res.sendStatus(200);
    }
    else {

        winston.log('Warning', {
            error: 'Invalid Company ID'
        });
        return res.status(400).json({
            "error": "Invalid Company ID",
            "message": "Invalid Company ID"
        });
    }

});



//Delete Company Record
route.delete('/delete/:c_id',(req,res)=>{

    if(validator.isNumeric(''+req.params.c_id)) {

        Company.findOne({c_id: req.params.c_id}, function (err, records) {
            console.log(records)
            if (err) {
                throw err;
            }
            else if (records == null)
            {
                winston.log('Warning', {
                    error: 'No Record Found'
                });
            }
            else {
                Student.find({}, function (err, stu) {
                    if (err) {
                        throw err;
                    }

                    for (i in stu) {

                        var index = stu[i].companiesRegistered.indexOf(records._id.toString());
                        if (index === -1) {

                        }
                        else {
                            stu[i].companiesRegistered.splice(index, 1);
                            stu[i].save();
                        }
                    }
                }).then(records => {
                    Company.remove({c_id: req.params.c_id}, function (err, r) {
                        if (err) {
                            throw err;
                        }
                    })
                });
            }

        });

        res.sendStatus(200);
    }
    else
    {
        winston.log('Warning', {
            error: 'Invalid Company ID'
        });
        return res.status(400).json({
            "error": "Invalid Company ID",
            "message": "Invalid Company ID"
        });

    }


});


module.exports = route;
const route = require('express').Router();
const Student = require('../../models/student');
const Company = require('../../models/company');
var ObjectId = require('mongoose').Types.ObjectId;

//Get all Students
route.get('/all', (req, res) => {

    Student.find({},function(err , records)
    {
        if (err) {
            throw err;
        }
        res.json(records);
    })
});


//Get one Student
//Sends null incase of no matching roll number
//Sends Json object of matched record incase found
route.get('/:rollno', (req, res) => {

    Student.findOne({ rollno:req.params.rollno }).
    populate('companies').
    exec(function (err, record) {
        if (err) return handleError(err);
        res.json(record);
    });
});


//Add New Student with/without companies
route.post('/add',(req,res)=>{

    let student = req.body;
    let st1;

    let array = student.companies;

    let query = {'c_id': {$in:array}};

    Company.find(query, function (err, r)
    {
        if (err) {
            throw err;
        }
        st1 = new Student({name : student.name,rollno: student.rollno, cgpa :student.cgpa, department:student.department },function (err, record)
        {
            if (err) {
                throw err;
            }

        });
        for ( i in r)
        {
            st1.companiesRegistered.push(r[i]._id);
        }
        st1.save();
        res.json(r);

    } );

});



//Edit Student Details
route.put('/edit/:rollno',(req,res)=>{

    var query = {rollno:req.params.rollno};
    var update = {
        name : req.body.name,
        department : req.body.department,
        cgpa: req.body.cgpa
    };
    Student.findOneAndUpdate(query,update,{},function (err, record)
    {
        if (err) {
            throw err;
        }
       recordG = record;

    });
    res.sendStatus(200)

});


//Delete Student Record
route.delete('/delete/:rollno',(req,res)=>{

    Student.remove({rollno:req.params.rollno},function (err,record) {
        if(err)
        {
            throw err;
        }
        res.json(record);
    });
});


//Get all Companies of particular Student
route.get('/:rollno/companies', (req, res) => {

    Student.findOne({rollno:req.params.rollno}, function (err, record)
    {
        if (err) {
            throw err;
        }
        res.json(record.companies);
    } );
});



module.exports = route;
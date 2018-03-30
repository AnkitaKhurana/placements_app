const route = require('express').Router();
const Student = require('../../models/student');

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

   Student.findOne({rollno:req.params.rollno}, function (err, record)
   {
       if (err) {
           throw err;
       }
       res.json(record);
   } );/*.populate('companies').exec(function (err, story) {

       if (err) return handleError(err);

       console.log('Companies Registered : %s', story.companies.name);

   });*/

});


//Add New Student
route.post('/add',(req,res)=>{

    let student = req.body;
    Student.create(student,function (err, record)
    {
        if (err) {
            throw err;
        }
        res.json(record);
    });
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
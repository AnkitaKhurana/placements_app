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
        if (err) {throw err}
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
            if( r[i].studentsRegistered.indexOf(st1._id) === -1) {
                r[i].studentsRegistered.push(st1._id);
                r[i].save();
            }
        }
        console.log(r)

        st1.save();
        res.json(r);

    } );

});



//Edit Student Details (with/without companies)
route.put('/edit/:rollno',(req,res)=>{


    Student.findOne({ rollno:req.params.rollno }).
    populate('companies').
    exec(function (err, stu) {


        if (err){ throw  err}
        Company.find({},function (err,comp)
        {
            if(err){
                throw err;
            }

            for ( i in comp)
            {
                var index = comp[i].studentsRegistered.indexOf(stu._id);
                if(index!==-1)
                {
                    comp[i].studentsRegistered.splice(index,1);
                    comp[i].save()
                }
            }


        })

    });


    let array = req.body.companies;
    let query1 = {'c_id': {$in:array}};

    Company.find(query1, function (err, r)
    {
        if (err) {
            throw err;
        }

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
            record.companiesRegistered = [];

            for ( i in r)
            {
                console.log(r[i]._id)
                record.companiesRegistered.push(r[i]._id);
                if( r[i].studentsRegistered.indexOf(record._id) === -1) {
                    r[i].studentsRegistered.push(record._id);
                    r[i].save();
                }
            }
            record.save()
            console.log(record)
        });

    } );
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


//Delete All Student Records
route.delete('/deleteAll',(req,res)=>{

    Student.remove({},function (err,record) {
        if(err)
        {
            throw err;
        }
        res.json(record);
    });
});


//Get all Companies Registered by a particular Student
route.get('/:rollno/companies', (req, res) => {


    Student.findOne({ rollno:req.params.rollno }).
    populate('companies').
    exec(function (err, record) {
        if (err) return handleError(err);

        let array = record.companiesRegistered;

        let query = {'_id': {$in:array}};

        Company.find(query,function(err , records)
        {
            if (err) {
                throw err;
            }
            res.json(records);
        });
    });
});



//Register/Unregister Company
route.put('/:rollno/edit/companies', (req, res) => {

    let array = req.body.companies;
    let query1 = {'c_id': {$in:array}};

    Company.find(query1, function (err, r)
    {
        if (err) {
            throw err;
        }

        var query = {rollno:req.params.rollno};
        Student.findOneAndUpdate(query,{},{},function (err, record)
        {
            if (err) {
                throw err;
            }
            record.companiesRegistered = [];

            for ( i in r)
            {
                console.log(r[i]._id)
                record.companiesRegistered.push(r[i]._id);
            }
            record.save()
            console.log(record)
        });

    } );
    res.sendStatus(200)

});



module.exports = route;
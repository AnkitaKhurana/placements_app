const route = require('express').Router();
const Company = require('../../models/company');

//Get all company objects
route.get('/all', (req, res) => {

    Company.find({},function(err , records)
    {
        if (err) {
            throw err;
        }
        res.json(records);
    })
});


//Get one Company
//Sends null incase of no matching Company Id
//Sends Json object of matched record incase found
route.get('/:c_id', (req, res) => {

    Student.findOne({c_id:req.params.c_id}, function (err, record)
    {
        if (err) {
            throw err;
        }
        res.json(record);
    } );

});




//Add New Company
route.post('/add',(req,res)=>{

    let comp = req.body;
    Company.create(comp,function (err, record)
    {
        if (err) {
            throw err;
        }
        res.json(record);
    });
});


//Edit CompanyDetails
route.put('/edit/:c_id',(req,res)=>{

    var query = {c_id:req.params.c_id};
    var update = {
        name : req.body.name,
        studentsRequired : req.body.studentsRequired,
        package: req.body.package,
        role: req.body.role,
    };
    Company.findOneAndUpdate(query,update,{},function (err, record)
    {
        if (err) {
            throw err;
        }

    });
    res.sendStatus(200)

});



//Delete Company Record
route.delete('/delete/:c_id',(req,res)=>{

    Student.remove({c_id:req.params.c_id},function (err,record) {
        if(err)
        {
            throw err;
        }
        res.json(record);
    });
});


module.exports = route;
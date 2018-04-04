const express = require('express');
const hbs = require('hbs');
var validator = require('express-validator');
//var expressSession = require('express-session');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mogodb://localhost:27017/appData');



var courseRating = mongoose.model('courseRating',{
	//Possiblities: have prereqs/coreqs, postreqs
	courseDep:{
		type: String
	},
	courseNum:{
		type: String
	},
	description:{
		type: String
	},
	difficulty:{
		type: Number
	},
	workload:{
		type: Number
	},
	practicality:{
		type: Number
	},
	enjoyment:{
		type: Number
	},
});


hbs.registerPartials(__dirname+"/views/partials")
//express middleware that allows for access to static folder
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

//handler for get request
app.get('/',function(req,res){
	res.render('index.hbs',{
		name: "Penelope"
	});
});
app.get('/rate',function(req,res){
	res.render('rate.hbs',{
		name: "Penelope",
		errors: 1
	});
});

app.post('/submit_rating',(req,res)=>{
	console.log(req.body)
	req.checkBody('courseDep',"Course Department must be 3-5 characters long").isLength({min:3,max:5})
		.isAlpha().withMessage("Course Department must only contain letters")
		.trim();
	req.checkBody('courseNum','Course Number must consist of 3 numbers').isLength({min:3,max:3})
		.isInt({allow_leading_zeroes:false}).withMessage('Course Number must be a number and cannot start with 0')
		.trim().toInt();
	
	req.checkBody('difficulty','Stop messing with the HTML, asshole').isLength({min:1,max:1}).isInt({gt:0,lt:6}).toInt();
	req.checkBody('workload','Stop messing with the HTML, asshole').isLength({min:1,max:1}).isInt({gt:0,lt:6}).toInt();
	req.checkBody('practicality','Stop messing with the HTML, asshole').isLength({min:1,max:1}).isInt({gt:0,lt:6}).toInt();
	req.checkBody('enjoyment','Stop messing with the HTML, asshole').isLength({min:1,max:1}).isInt({gt:0,lt:6}).toInt();

	req.checkBody('comments','Comments must be under 140 characters').isLength({max:140});
	var errors = req.validationErrors();
	console.log(req.body)
	if (errors) {
		res.render('rate', { errors: errors });
		return;
	}
	else{
		res.redirect('success');
	}
});
//Todo: bar anyone from this http if they didn't JUST submit a form
app.get('/submit_rating/success',(req,res)=>{
	res.render('rateSuccess.hbs');
});
//function is a callback, but this function can do more if desired.
app.listen(3000,function(){
	console.log("Server Started on Port 3000...");
})
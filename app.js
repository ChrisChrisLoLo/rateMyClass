const express = require('express');
const hbs = require('hbs');
var validator = require('express-validator');
//var expressSession = require('express-session');
var bodyParser = require('body-parser');
var app = express();

const port = process.env.PORT || 3000;


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appData');

var CourseRating = mongoose.model('CourseRating',{
	//Possiblities: have prereqs/coreqs, postreqs
	courseDep:{
		type: String,
		required: true,
		minlength:1,
		maxlength:5,
		trim: true
	},
	courseNum:{
		type: Number,
		required: true,
		minlength:1,
		maxlength:5,
		trim: true
	},
	difficulty:{
		type: Number,
		required: true
	},
	workload:{
		type: Number,
		required: true
	},
	practicality:{
		type: Number,
		required: true
	},
	enjoyment:{
		type: Number,
		required: true
	},
	overall:{
		type: Number,
		default:null
	},
	comments:{
		type: String,
		trim: true,
		default:null
	},
	description:{
		type: String,
		trim: true,
		default:null
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
app.get('/rateCourse',function(req,res){
	res.render('rate.hbs',{
		name: "Penelope",
		errors: null
	});
});

app.post('/submitRating',(req,res)=>{
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

	req.checkBody('comments','Comments must be under 140 characters').isLength({max:140}).trim();
	var errors = req.validationErrors();
	console.log(req.body)
	if (errors) {
		res.render('rate', { errors: errors });
		return;
	}
	else{
		var overall = ((parseInt(req.body.difficulty)+parseInt(req.body.workload)+parseInt(req.body.practicality)+parseInt(req.body.enjoyment))/4)
		var formRating = new CourseRating({
			courseDep:req.body.courseDep.toUpperCase(),
			courseNum:parseInt(req.body.courseNum),
			difficulty:parseInt(req.body.difficulty),
			workload:parseInt(req.body.workload),
			practicality:parseInt(req.body.practicality),
			enjoyment:parseInt(req.body.enjoyment),
			comments:req.sanitize(req.body.comments),
			overall:parseFloat(overall)
		});
		formRating.save().then(()=>{res.redirect('success');
		},(e) => {
			console.log("Unable to store form: ",e);
		});
	}
});
//Todo: bar anyone from this http if they didn't JUST submit a form
app.get('/submitRating/success',(req,res)=>{
	res.render('rateSuccess.hbs');
})
app.get('/viewCourse',(req,res)=>{
	res.render('viewCourse.hbs');
});
app.post('/viewCourse',(req,res)=>{
	res.redirect('/viewCourse'+"/"+req.body.courseDep.toUpperCase()+'/'+req.body.courseNum)
});
//TODO: GET CUSTOM ROUTE and process data
app.get('/viewCourse/:courseDep/:courseNum',(req,res)=>{

	CourseRating.find({
		courseDep:req.params.courseDep,
		courseNum:req.params.courseNum
		},
		(err,courseRatings)=>{
			if (err){
				//TODO: MAKE ERROR HBS
				res.render('index.hbs');
				return console.error(err);
			}
			console.log(typeof courseRatings)
			console.log(courseRatings);
			res.render('viewCourseSel.hbs',{courseDep:req.params.courseDep,
											courseNum:req.params.courseNum,
											entries:courseRatings,
											});
	});
});

//function is a callback, but this function can do more if desired.
app.listen(port,function(){
	console.log("Server Started on Port "+port+"...");
});
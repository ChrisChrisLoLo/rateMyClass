const express = require('express');
const hbs = require('hbs');
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
app.use(express.static(__dirname + '/public'));
//handler for get request
app.get('/',function(req,res){
	res.render('index.hbs',{
		name: "Penelope"
	});
});
app.get('/rate',function(req,res){
	res.render('rate.hbs',{
		name: "Penelope"
	});
});


//function is a callback, but this function can do more if desired.
app.listen(3000,function(){
	console.log("Server Started on Port 3000...");
})
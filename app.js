const express = require('express');
const hbs = require('hbs');
var app = express();



hbs.registerPartials(__dirname+"/views/partials")
//express middleware that allows for access to static folder
app.use(express.static(__dirname + '/public'));
//handler for get request
app.get('/',function(req,res){
	res.render('index.hbs',{
		name: "Penelope"
	});
});

app.get('/demo',function(req,res){
	res.render('index.hbs',{
		name: "Penelope"
	});
});
//function is a callback, but this function can do more if desired.
app.listen(3000,function(){
	console.log("Server Started on Port 3000...");
})
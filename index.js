const express=require('express');
const app=express();
const bodyParser = require('body-parser')
var user=require('./routes/user')
var auth=require('./routes/login')
var friends = require('./routes/friends')
var photoservice = require('./routes/photoservice')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test',function(err,data){
	if(err)
		console.log(err)
});
app.listen(3000);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/ping',function(req,res){

})
console.log('user')
app.use('/users',user)
app.use('/',auth)
app.use('/friends',friends)
app.use('/photoservice',photoservice)
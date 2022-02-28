const express=require('express');
const app=express();
const bodyParser = require('body-parser')
var auth=require('./routes/auth')
var features=require('./routes/features')
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
app.use('/auth',auth)
app.use('/features',features)
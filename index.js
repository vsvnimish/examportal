const express=require('express');
const app=express();
const bodyParser = require('body-parser')
var user=require('./routes/user')
var auth=require('./routes/login')
app.listen(3000);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get('/ping',function(req,res){

})
app.use('/users',user)
app.use('/',auth)

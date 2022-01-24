const mongoose = require('mongoose');
const user_schema=require('../models/users').User_schema
console.log('userdb')
const emailchecker = async(req,res,next)=>{
	console.log(req.data._id)
	const data= await user_schema.findOne({_id : req.data._id})

	if(data.email_verified)
		next()
	else
		res.status(500).json('please verify your mail')
}
module.exports=emailchecker
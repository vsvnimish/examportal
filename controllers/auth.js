require('dotenv').config();
var crypto = require('crypto');
const {v4 : uuidv4 }= require('uuid')
const currentdate=new Date()
const create_obj = require('../helpers/help.js').create_object
const help = require('../helpers/help.js')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const user_schema=require('../models/users')
const signup = async (req,res) => {
	console.log('start')
	req.body.hash=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	req.body._id = uuidv4()
	const info = await create_obj(req.body)
	const username = await user_schema.find({username : req.body.username})
	const email = await user_schema.find({email: req.body.email})
	if(username.length!=0)
		return res.status(500).json('username already exists')
	if(req.body.email==req.data.email && req.data.email_verified){
    	info.created_at= help.time()
    	var newuser=new user_schema(info)
    	await newuser.save()
    	return res.status(500).json('added succesfully')
	}
	else{
       return res.status(500).json('please verify your mail')
	}  
}
const send_verification = async (req,res) =>{
	res.status(200).json({msg: "verification mail has been sent",token : await help.send_verification_mail(req.body)})	
}
const email_verify =async (req,res) => {
	console.log('email_verify')
	if(req.data.otp==req.body.otp){
		req.data.email_verified=true
		const token=jwt.sign(JSON.stringify(req.data),process.env.SECRET_KEY)
		return res.status(200).json({msg : "email has been verified",token : token})
	}
	else{
		return res.status(500).json("invalid otp")
	}	
}
const reset_password = async(req,res) => {
	const hash1=crypto.pbkdf2Sync(req.body.oldpassword,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	const data = await user_schema.findOne({username : req.body.username,hash : hash1})
	console.log(data)
	if(data){
		const hash2=crypto.pbkdf2Sync(req.body.newpassword,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
		await user_schema.updateOne({username : req.body.username},{hash : hash2})
		res.status(200).json("password changed sucessfully")
	}
	else{
		res.status(200).json("old password that you have entered is incorrect")
	}
}
const forgot_password =async (req,res) => {
	var data =create_obj(await user_schema.findOne({email : req.body.email}))
	if(data){
		await axios.post('http://localhost:3000/auth/send-verification',data).then((response)=>{
			res.status(500).json({msg : 'otp has been sent to your mailid,please verify it for changing password' , token : response.data.token})
		}) 
	}
	else{
		res.status(500).json({msg : "account doesnot exists"})
	}
}
const change_password = async(req,res) =>{
	if(req.data.email_verified == true){
		const hash=crypto.pbkdf2Sync(req.body.newpassword,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
		await user_schema.updateOne({email : req.data.email},{hash : hash})
		res.status(200).json("password changed sucessfully")
	}
	else{
		res.status(200).json("please verify your email")
	}
}
const login = async(req,res)=>{
	console.log('hi')
	const username=req.body.username
	const password=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	const data = await user_schema.findOne({username : username,hash : password})
    if(data){
	    const token=jwt.sign(data.toJSON(),process.env.SECRET_KEY) 
	    res.status(200).json({msg : "login successfull",token : token})
    }
    else
      res.status(200).json("invalid username or password")
}
module.exports={
	signup,
	forgot_password,
	email_verify,
	send_verification,
	reset_password,
	change_password,
	login
}

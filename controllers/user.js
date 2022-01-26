require('dotenv').config();
var crypto = require('crypto');
const {v4 : uuidv4 }= require('uuid')
const currentdate=new Date()
const create_obj = require('../helpers/help.js').create_object
const help = require('../helpers/help.js')
const user_schema=require('../models/users').User_schema
const axios = require('axios')
const signup = async (req,res) => {
    req.body.hash=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
    req.body._id = uuidv4()
    req.body.email_verified=false
    const info = await create_obj(req.body)
    const username = await user_schema.find({username : req.body.username})
    const email = await user_schema.find({email: req.body.email})
    if(email.length!=0){//user with same emailid has been found
	if(email.email_verified)//if his mail is verified
		   res.status(500).json('invalid email')
	else{//if not verified
	   await axios.post('http://localhost:3000/users/send_verification',info).then((response)=>{
		 res.status(500).json({msg : 'otp has been sent to your mailid,please verify it for signing up' , token : response.data.token})
	   })    
	}
    }
    else{ //solo user
	info.created_at= help.time()
	info.updated_at= help.time()
	var newuser=new user_schema(info)
	await newuser.save()
	res.status(500).json('added succesfully,please verify your mail')
    } 	
}
const send_verification = async (req,res) =>{
    res.status(200).json({msg: "verification mail has been sent",token : await help.send_verification_mail(req.body)})	
}
const email_verify =async (req,res) => {
	if(req.data.otp==req.body.otp){
		const data = await user_schema.find({username : req.data.username})
		if(data.length!=0){
		  await user_schema.updateOne({username : req.data.username},{email_verified : true})
		  if(req.data.parent=='forgot_password'){
                    res.status(200).json({'msg' : 'verified succesfully,use below token for changing password','token' : req.token})   
                  } 
		  else{
                  res.status(200).json("your email has been verified succesfully")
                  }
		}
	        else{
                    await user_schema.deleteMany({email : req.data.email})
                    const info=create_obj(req.data)
                    info.email_verified=true
                    info.created_at= help.time()
                    info.updated_at= help.time()
                    var newuser=new user_schema(info)
                    await newuser.save()
                    res.status(200).json("your account has been succesfully added")
		}
	}
	else{
	   res.status(500).json("invalid otp")
	}	
}
const get_profile = async (req,res) => {
	const acess_user = await user_schema.findOne({_id : req.params.id})
	if(acess_user.status != "private")
		res.status(200).json(acess_user.username+" "+acess_user.loc)
	else
		res.status(200).json(acess_user.username)
}

const update_profile =async (req,res) => {
	const acess_user = await user_schema.findOne({_id : req.params.id})
	// console.log(req.username,acess_user[0].username)
	if(req.data.username==acess_user.username && acess_user.email_verified){
		req.body.updated_at= help.time()
		await userdb.update_user({_id : req.params.id},{status : req.body.status,loc : req.body.loc,updated_at : help.time()})
		return res.status(200).json("updtaed sucessfully")
	}
	else if(!acess_user.email_verified)
		return res.status(200).json("cannot update,because email is not verified")
	else
           return  res.status(200).json("not your account")

}
const get_user = async (req,res) => {
	if(!req.body.name)
		req.body.name=''
	const data = await user_schema.findOne({username : {$regex: req.body.name,$options:"$i"} })
	const items = data.slice(0,Math.min(100,data.length))
	res.status(200).json(items.map( (obj) => {return {username : obj.username}}))
}

const forgot_password =async (req,res) => {
	await user_schema.updateOne({email : req.body.email,username : req.body.username},{email_verified : false})
    var data =create_obj(await user_schema.findOne({email : req.body.email,username : req.body.username}))
	if(data){
		data.parent="forgot_password"
		await axios.post('http://localhost:3000/users/send_verification',data).then((response)=>{
           	  res.status(500).json({msg : 'otp has been sent to your mailid,please verify it for changing password' , token : response.data.token})
        }) 
	}
	else{
		res.status(500).json({msg : "account doesnot exists"})
	}
}
const change_password = async(req,res) => {
	const data = await user_schema.findOne({email : req.data.email})
	if(data.email_verified == true && req.data.parent=='forgot_password'){
        const hash=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
		await user_schema.updateOne({email : req.data.email},{hash : hash,updated_at : help.time()})
		res.status(200).json("password chnged sucessfully")
	}
	else{
		res.status(200).json("please verify your email")
	}
}
module.exports={
	signup,
	get_profile,
	update_profile,
	get_user,
	forgot_password,
	email_verify,
	send_verification,
	change_password
}

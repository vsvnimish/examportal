require('dotenv').config();
var crypto = require('crypto');
const userdb=require('../services/userdb')
const {v4 : uuidv4 }= require('uuid')
const currentdate=new Date()
const create_obj = require('../helpers/help.js').create_object
const help = require('../helpers/help.js')
const jwt = require('jsonwebtoken');
const signup = async (req,res) => {
	req.body.hash=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	req.body._id = uuidv4()
	const data = await userdb.find_user({username : req.body.username})
	const val = await userdb.find_user({email: req.body.email}) 
	const token_2=jwt.sign(create_obj(req.body),process.env.SECRET_KEY)
	const authHeader = req.headers['authorization']
	const token = (authHeader && authHeader.split(' ')[1])
	const d2 = jwt.verify(token,process.env.SECRET_KEY,async (err,dec)=>{
		if(err){
			if(data.length==0){
				if(val.length==0){
					req.body.email_verified = false
					req.body.created_at= help.time()
					req.body.updated_at= ''
					var msg=await userdb.add_user(create_obj(req.body)) 
					res.status(200).json({msg : msg + ",please verify your mail"})
				}
				else{
					if(!val[0].email_verified)
						res.status(200).json({msg : "duplicate email found,verify your mail to add your account"})
					else
						res.status(200).json({msg : "account already exists"})
				}
			}
			else{
				res.status(200).json({msg : "username already exists"})
			}
		} 
		else{
			if(dec.ver && req.body.email==dec.email && req.body.username==dec.username){
				await userdb.delete_user({email : req.body.email})
				req.body.email_verified = true
				req.body.updated_at = help.time()
				res.status(200).json(await userdb.add_user(create_obj(req.body)))
			}
			else{
				res.status(200).json({msg : "please verify your mail",token : token_2})
			}
		}
	})
}

const get_profile = async (req,res) => {
	const acess_user = await userdb.find_user({_id : req.params.id})
	if(acess_user[0].status != "private")
		res.status(200).json(acess_user[0].username+" "+acess_user[0].loc)
	else
		res.status(200).json(acess_user[0].username)
} 
const update_profile =async (req,res) => {
	const acess_user = await userdb.find_user({_id : req.params.id})
	// console.log(req.username,acess_user[0].username)
	if(req.data.username==acess_user[0].username && acess_user[0].email_verified){
		req.body.updated_at= help.time()
		await userdb.update_user({_id : req.params.id},{status : req.body.status,loc : req.body.loc})
		res.status(200).json("updtaed sucessfully")
	}
	else if(!acess_user[0].email_verified)
		res.status(200).json("cannot update,because email is not verified")
	else
        res.status(200).json("not your account")
}
const get_user = async (req,res) => {
	if(!req.body.name)
		req.body.name=''
	const data = await userdb.find_user({username : {$regex: req.body.name,$options:"$i"} })
	const items = data.slice(0,Math.min(100,data.length))
	res.status(200).json(items.map( (obj) => {return {username : obj.username}}))
}
const forgot_password =async (req,res) =>{
	const data = await userdb.update_user({email : req.body.email},{email_verified : false})
	if(data!=[])
		res.status(200).json({msg : 'verification mail has been sent',token :await help.send_verification_mail(req.body)})
	else{
		res.status(500).json({msg : "account doesnot exists"})
	}
}
const send_verification = async (req,res) =>{
	const authHeader = req.headers['authorization']
	const token = (authHeader && authHeader.split(' ')[1])
	const d2 = jwt.verify(token,process.env.SECRET_KEY,async (err,dec)=>{
		if(err){
            const token = await help.send_verification_mail(req.body)
            res.status(200).json({msg: "verification mail has been sent",token : token})
		}
		else{
			console.log('dec->',dec)
		    const data= await userdb.find_user({username  : dec.username,hash : dec.hash})
		    dec.email=data[0].email
           const token = await help.send_verification_mail(dec)
           res.status(200).json({msg: "verification mail has been sent",token : token})
		}
	})
	
}
const email_verify =async (req,res) => {
	if(req.data.otp==req.body.otp){
		req.data.ver=true
		userdb.update_user({email : req.data.email},{email_verified : true,updated_at : help.time()})
		const token=jwt.sign(req.data,process.env.SECRET_KEY)
	    res.status(200).json({msg: "correct otp",token : token})
	}
	else{
		req.data.ver=false
		const token=jwt.sign(req.data,process.env.SECRET_KEY)
	    res.status(200).json({msg: "incorrect otp",token : token})
	}
	
}
const change_password = async(req,res) => {
	const data = await userdb.find_user({email : req.data.email})
	console.log('data',data,req.data)
	if(data[0].email_verified == true){
        const hash=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
		userdb.update_user({email : req.data.email},{hash : hash,updated_at : help.time()})
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
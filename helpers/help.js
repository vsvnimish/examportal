
require('dotenv').config();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const userdb=require('../services/userdb')
const user_schema=require('../models/users').User_schema
const create_object = (obj) => {
	var user = {
		_id : obj._id,
		username : obj.username,
		hash : obj.hash,
		email : obj.email,
	}
	return user
}
const send_verification_mail = async (info) => {
	console.log('SE->',process.env.SECRET_KEY)
	var otp=Math.floor(100000 + Math.random() * 900000) + "";
	console.log('data',info.email)
	info.otp=otp
	console.log('info',info)
	const token=jwt.sign(info,process.env.SECRET_KEY)
	let transporter = nodemailer.createTransport({
		service : 'gmail',
		auth: {
         user: process.env.MAIL_ID, // generated ethereal user
         pass: process.env.PASS, // generated ethereal password
     },
 });
	let maildetails={
  	     from: process.env.MAIL_ID, // sender address
         to: info.email, // list of receivers
         subject: "OTP from nodemailer", // Subject line
         text: otp  // plain text body
     }

     let inf = await transporter.sendMail(maildetails,(err,data)=>{
     	 console.log('ji',data)
     });
     return token
 } 
 const time = ()=>{
 	let date_time = new Date();
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
 	let date = ("0" + date_time.getDate()).slice(-2);
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
} 
const time_diff = (time1,time2)=>{
	 const atime1 = time1.split(":")
	 const atime2=time2.split(":")
	 for(var i=0;i<atime2.length()-1;i++){
       if(atime1[i]!=atime2[i]){
       	return "more"
       }
	 }
	 return "less" //in seconds
}
const get_usernames = async (userid) =>{
	console.log(userid)
	const userids = userid.map((user)=>{return {'_id' : user}})
	try{
		const data =await user_schema.find({$or : userids})
	    const usernames = data.map((user)=>{
		  return user.username
	    })
        return usernames
	}
	catch{
		return []
	}
	
}
const getCode = async(req,res)=>{
	var length = 5;
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * 
			charactersLength));
	}
	console.log(result)
   return result;
}
module.exports={
	create_object,
	send_verification_mail,
	time,
	get_usernames,
	getCode,
	time_diff
}
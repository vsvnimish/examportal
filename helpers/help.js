
require('dotenv').config();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const userdb=require('../services/userdb')
const create_object = (obj) => {
	var user = {
		_id : obj._id,
		username : obj.username,
		hash : obj.hash,
		email : obj.email,
		email_verified : obj.email_verified,
		created_at :  obj.created_at,
		updated_at   : obj.updated_at,
		status  : obj.status,
		loc : obj.loc
	}
	return user
}
const send_verification_mail = async (info) => {
	console.log('SE->',process.env.SECRET_KEY)
	var otp=Math.floor(100000 + Math.random() * 900000) + "";
	// console.log('data',data)
	info.otp=otp
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
     let inf = await transporter.sendMail(maildetails);
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
module.exports={
	create_object,
	send_verification_mail,
	time
}
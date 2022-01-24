require('dotenv').config();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userdb = require('../services/userdb')
login = async (req,res) => {
	console.log('hi')
	const username=req.body.username
	const password=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	const user={username : username,hash : password}
	const data = await userdb.find_user(user)
	console.log('d',data[0])
	const k = data[0]
    if(data.length==1){
	    const token=jwt.sign(data[0].toJSON(),process.env.SECRET_KEY)
	    res.status(200).json({msg : "login successfull",token : token})
    }
    else
      res.status(200).json("invalid username or password")
} 
module.exports={
	login
}
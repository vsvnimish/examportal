require('dotenv').config();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userdb = require('../services/userdb')
login = async (req,res) => {
	const username=req.body.username
	const password=crypto.pbkdf2Sync(req.body.password,process.env.SECRET_KEY,1000, 64, `sha512`).toString(`hex`)
	
	const user={username : username,hash : password}
	const data = await userdb.find_user(user)
    if(data.length==1){
	    const token=jwt.sign(user,process.env.SECRET_KEY)
	    res.status(200).json({msg : "login successfull",token : token})
    }
    else
      res.status(200).json("invalid username or password")
} 
module.exports={
	login
}
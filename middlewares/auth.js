const jwt = require('jsonwebtoken');
require('dotenv').config();
auth = (req,res,next) => {
	const authHeader = req.headers['authorization']
	const token = (authHeader && authHeader.split(' ')[1] ) || req.params.token
	console.log(token)
	if (token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.SECRET_KEY, (err, user) => {
		console.log(err)
		if (err) return res.sendStatus(403)
		console.log(user)
	    req.data=user
	    req.token=token
	    next()
	})
} 
module.exports={
	auth
}
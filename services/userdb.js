const mongoose = require('mongoose');
const user_schema=require('../models/users').User_schema
mongoose.connect('mongodb://localhost:27017/test');
console.log("running")
const  add_user = async (user) => {
	const len = await find_user({username : user.username})
	if (len.length!=0){
		console.log("user name already exists")
		return "user name already exists"
	}
	else{
		console.log("addeduser->",user)
		var newuser=new user_schema(user)
		newuser.save()
		return "added succesfully"
	}
}
const find_user = async (user) =>{
	console.log('user->',user)
	const data= await user_schema.find(user)
	console.log('dtata->',data)
	return data
}
const delete_user =async (user) =>{
    const len = await find_user(user)
    if(len.length!=0){
      console.log("len->",len)
	  // const data = await user_schema.findByIdAndDelete(user)
	  const data = await user_schema.deleteMany(user)
	  return data
    }
	return "can't delete"
}
const update_user = async (search,update) =>{
	console.log(search)
	await user_schema.updateOne(search,{$set:update})
	return "updated"
}
module.exports={
	add_user,
	find_user,
	delete_user,
	update_user
}

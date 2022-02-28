const mongoose=require("mongoose")
const user_schema = mongoose.model('user_schema', { 
	_id :  String,
	username : String,
	hash : String,
	email :String,
	created_at :  String,
});
module.exports=user_schema
	

const mongoose=require("mongoose")
const User_schema = mongoose.model('user_schema', { 
	_id :  String,
	username : String,
	hash : String,
	email :String,
	email_verified : Boolean,
	created_at :  String,
	updated_at   : String,
	status : String,
	loc : String
});
module.exports={
	User_schema
}

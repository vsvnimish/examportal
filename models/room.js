const mongoose=require("mongoose")
const room_schema = mongoose.model('room_schema', { 
	roomid :  String,
    roomname : String,
    roomadmin : String,
    roomcode : String,
    users : [String]
});
module.exports=room_schema
	

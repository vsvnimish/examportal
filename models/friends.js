const mongoose=require("mongoose")
const friendschema = new mongoose.Schema({
  user : {
    type: String
  },
  friends : [{
  	type: String
  }],
  requested_friends : [{
  	type: String
  }] ,
  followers : [{
    type: String
  }] 
});
const friends = mongoose.model('friends',friendschema)
module.exports = friends;

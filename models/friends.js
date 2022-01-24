const mongoose=require("mongoose")
const friendschema = new mongoose.Schema({
  user : {
    type: String,
    ref: 'User'
  },
  friends : [{
  	type: String,
    ref: 'User'
  }],
  requested_friends : [{
  	type: String,
    ref: 'User'
  }] ,
  followers : [{
    type: String,
    ref: 'User'
  }] 
});
const friends = mongoose.model('friends',friendschema)
module.exports = friends;

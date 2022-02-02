const mongoose=require("mongoose")
const commentschema = new mongoose.Schema({
  _id : String,
  user : String,
  text : String,
  post_id :String
});
const comments = mongoose.model('comments',commentschema)
module.exports = comments;

const mongoose=require("mongoose")
const reply_commentschema = new mongoose.Schema({
  _id : String,
  user : String,
  comment_id :String,
  text : String
});
const reply_comments = mongoose.model('reply_comments',reply_commentschema)
module.exports = reply_comments;

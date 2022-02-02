const mongoose=require("mongoose")
const likeschema = new mongoose.Schema({
  _id : String,
  likes : [String],
  unlikes : [String],
  like_count : Number
});
const likes = mongoose.model('likes',likeschema)
module.exports = likes;

const mongoose=require("mongoose")
const postschema = new mongoose.Schema({
  _id : String,
  user : String,
  img : String,
  description : String,
  acess : String
});
const posts = mongoose.model('posts',postschema)
module.exports = posts;

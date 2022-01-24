const mongoose=require("mongoose")
const photoschema = new mongoose.Schema({
  user : {
    type: String,
    ref: 'User'
  },
  photos : [{
  	type: String,
    ref: 'User'
  }],
});
const photos = mongoose.model('photos',photoschema)
module.exports = photos;

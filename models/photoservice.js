const mongoose=require("mongoose")
const photoschema = new mongoose.Schema({
  user : {
    type: String
  },
  photos : [{
  	type: String
  }]
});
const photos = mongoose.model('photos',photoschema)
module.exports = photos;

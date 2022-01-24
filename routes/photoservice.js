var express = require("express");
var router = express.Router();
var friends = require('../controllers/friends') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
const cors = require('cors');
const multer = require('multer')
const path=require('path')
const photo_db = require('../models/photoservice')
const emailchecker=require('../middlewares/emailchecker')
router.use(auth.auth)
router.use(emailchecker)
router.use(cors());
// parse routerlication/json
router.use(bodyParser.json());
// parse routerlication/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}));
// serving static files
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../uploads'));
   },
   filename: function (req, file, cb) {
      cb(null,file.originalname);
   }
});
var upload = multer({ storage: storage });
router.use(async (req,res,next)=>{
	const sender_id = req.data._id 
     const data1= await photo_db.findOne({user : sender_id})
     if(!data1 && sender_id){
      const photo = {
             user : sender_id,
             images : []
           }
           var newf=new photo_db(photo)
           await newf.save()
     }
    next()    
})
router.post('/uploadphoto', upload.single('img'),async (req, res) => {
   const file = req.file;
   if (!file){
      return res.status(400).send({ message: 'Please upload a file.' });
   }
   await photo_db.updateOne({user : req.data._id},{$push: {photos : req.file.path }}) 
   return res.send({ message: 'File uploaded successfully.', file });
});
router.post('/deletephoto',async (req,res)=>{
	  await photo_db.updateOne({user : req.data._id},{$pull: {photos : req.body.path }}) 
	  res.status(200).json('photo_deleted')
})
router.get('/getphoto',async (req,res) =>{
    res.sendFile(req.body.path)
})
module.exports = router;
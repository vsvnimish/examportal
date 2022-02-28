var express = require("express");
var router = express.Router();
var features = require('../controllers/features') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
router.use(auth)
router.post('/create-room',features.create_room)
router.post('/join-room',features.join_room)
module.exports = router;

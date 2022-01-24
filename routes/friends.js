var express = require("express");
var router = express.Router();
var friends = require('../controllers/friends') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
const emailchecker=require('../middlewares/emailchecker')
router.use(auth.auth)
router.use(emailchecker)
router.use(friends.pre)
router.use('/*/:username',friends.pre)
router.post('/send_friend_req/:username',friends.send_friend_req)
router.get('/get_friend_req',friends.get_friend_req)
router.post('/approve_friend_req/:username',friends.approve_friend_req)
router.get('/get_friends',friends.get_friends)
router.post('/remove_friend/:username',friends.remove_friend)
router.get('/get_friend_sugg',friends.get_friend_sugg)
router.post('/followuser/:username',friends.followuser)
router.post('/unfollowuser/:username',friends.unfollowuser)
module.exports = router;
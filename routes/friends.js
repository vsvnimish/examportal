var express = require("express");
var router = express.Router();
var friends = require('../controllers/friends') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
router.use(auth.auth)
router.use('/*/:userid',friends.pre)
router.use(friends.pre)
router.post('/send_friend_req/:userid',friends.send_friend_req)
router.get('/get_friend_req',friends.get_friend_req)
router.post('/approve_friend_req/:userid',friends.approve_friend_req)
router.get('/get_friends',friends.get_friends)
router.post('/remove_friend/:userid',friends.remove_friend)
router.get('/get_friend_sugg',friends.get_friend_sugg)
router.post('/followuser/:userid',friends.followuser)
router.post('/unfollowuser/:userid',friends.unfollowuser)
module.exports = router;
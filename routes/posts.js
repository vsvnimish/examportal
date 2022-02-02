var express = require("express");
var router = express.Router();
var posts = require('../controllers/posts') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
const emailchecker=require('../middlewares/emailchecker')
router.use(auth)
router.use(emailchecker)
router.post('/create_post',posts.create_post)
router.post('/update_post/:id',posts.update_post)
router.post('/delete_post/:id',posts.delete_post)
router.post('/get_post',posts.get_post)
router.post('/like_post/:id',posts.like_post)
router.post('/unlike_post/:id',posts.unlike_post)
router.post('/create_comment/:id',posts.create_comment)
router.post('/update_comment/:id',posts.update_comment)
router.post('/delete_comment/:id',posts.delete_comment)
router.post('/get_comment/:id',posts.get_comment)
router.post('/reply_comment/:id',posts.reply_comment)
router.post('/feed',posts.feed)
module.exports = router;
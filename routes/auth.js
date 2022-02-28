var express = require("express");
var router = express.Router();
var user = require('../controllers/auth') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
router.post('/send-verification',user.send_verification)
router.post('/reset-password',user.reset_password)
router.post('/login',user.login)
router.post('/forgot-password',user.forgot_password)
router.use(auth)
console.log('user')
router.post('/verify-email',user.email_verify)
router.post('/signup',user.signup)
router.post('/change-password',user.change_password)
module.exports = router;
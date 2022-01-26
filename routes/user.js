var express = require("express");
var router = express.Router();
var user = require('../controllers/user') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
router.post('/signup',user.signup)
router.post('/send_verification',user.send_verification)
router.get('/:id',user.get_profile)
router.get('/',user.get_user)
router.post('/forgot_password',user.forgot_password)
router.use(auth)
router.post('/email_verify',user.email_verify)
router.put('/:id',user.update_profile)
router.post('/change_password',user.change_password)
module.exports = router;
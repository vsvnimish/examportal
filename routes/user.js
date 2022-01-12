var express = require("express");
var router = express.Router();
var user = require('../controllers/user') 
const bodyParser = require('body-parser')
const auth=require('../middlewares/auth')
router.post('/signup',user.signup)
router.get('/:id',user.get_profile)
router.get('/',user.get_user)
router.put('/:id',auth.auth,user.update_profile)

router.post('/forgot_password',user.forgot_password)
router.post('/send_verification',user.send_verification)
router.post('/change_password/:token',auth.auth,user.change_password)
// router.use(auth.auth)
router.post('/email_verify',auth.auth,user.email_verify)



module.exports = router;
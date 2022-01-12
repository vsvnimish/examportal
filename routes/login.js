var express = require("express");
var router = express.Router();
var log=require('../controllers/login')
var auth=require('../middlewares/auth')
router.post('/login',log.login)
module.exports = router;
API's for                                            
POST : signup : http://localhost:3000/users/signup 
       body : {  
         "username" : 'username',
         "password" : 'password',
         "email" : "mailid",
         "status" : "public/private",
         "loc" : "your location"
       }
       Bearer Token : 'required if you have verified your mail else not required'   
POST : login  : http://localhost:3000/login
       body : {
          "username" : 'username',
          "password" : 'password'
        }
POST : sending verification mail : http://localhost:3000/users/send_verification
        Beaarer Token : 'enter the token that you have received 'after signup /after forgot_password''
POST : verifying mail : http://localhost:3000/users/email_verify
        body : {
          'otp' : 'enter otp you have received through mail'
        }
        Beaarer Token : 'enter the token that you have received after sending verification mail'
POST : forgot_password : http://localhost:3000/users/forgot_password
       body : {
          "username" : 'username',
          "email" : 'mailid'
        }
POST : change_password : http://localhost:3000/users/change_password/'enter your token that you have received after verifying mail'
       body : {
          "password" : 'password'
        }
PUT  : update_profile : http://localhost:3000/users/'enter userid'
       body : {
           "status" : "public/private",
           "loc" : "your location"
       }
       Bearer token : 'token you have received after login'
GET  : get_profile : http://localhost:3000/users/'enter userid'
GET  : get_user : http://localhost:3000/users

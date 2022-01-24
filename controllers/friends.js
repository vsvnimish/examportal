require('dotenv').config();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userdb = require('../services/userdb')
const friends = require('../models/friends')
const friends_db = require('../models/friends')
const user_schema=require('../models/users').User_schema
const help = require('../helpers/help.js')
console.log('friend')
const pre = async (req,res,next) =>{
   const target_userid = req.params.username
   const sender_id = req.data.username 
   const data1= await friends_db.findOne({user : sender_id})
   const data2= await friends_db.findOne({user : target_userid})
   if(!data1 && sender_id){
      const friend = {
       user : sender_id,
       friends : [],
       requested_friends : [],
       followers : []
     }
     var newf=new friends_db(friend)
     await newf.save()
   }
   if(!data2 && target_userid){
     const friend = {
       user : target_userid,
       friends : [],
       requested_friends : [],
       followers : []
     }
     var newf=new friends_db(friend)
     await newf.save()
   } 
     console.log('kl',req.params.username )
   next()    
 }
const send_friend_req = async (req,res) => {
  await friends.updateOne({user : req.params.username }, { $push: { requested_friends : req.data.username } })
  res.status(200).json({msg : "request sent"})
} 
const get_friend_req = async(req,res) =>{
  const data = await friends.findOne({user : req.data.username})
  res.status(200).json(data.requested_friends)
}
const approve_friend_req = async(req,res) =>{
  await friends.updateOne({user : req.data.username},{$pull: {requested_friends : req.params.username }}) 
  await friends.updateOne({user : req.data.username},{$push: {friends : req.params.username}}) 
  await friends.updateOne({user : req.params.username},{$push: {friends : req.data.username }}) 
  res.status(200).json('aprroved')
}
const reject_friend_req= async(req,res) =>{
  await friends.updateOne({user : req.data.id},{$pull: {requested_friends : req.params.username }}) 
  res.status(200).json('rejected')
}
const get_friends = async(req,res) =>{
  const data = await friends.findOne({user : req.data.username})
  res.status(200).json(data.friends)
}
const remove_friend = async(req,res) =>{
  await friends.updateOne({user : req.data.username},{$pull: {friends : req.params.username}}) 
  await friends.updateOne({user : req.params.username},{$pull: {friends :  req.data.username }}) 
  res.status(200).json('removed')
}
const get_friend_sugg = async(req,res) =>{
  const data=await user_schema.findOne({username : req.data.username})
  const friends_list=await friends.findOne({user : req.data.username}) 
  friends_list.friends.push(req.data.username)
  const sugg_list = await user_schema.find({username : {$nin : friends_list.friends}})
  const u_sugg = sugg_list.map((user)=>{return user.username})
  res.status(200).json(u_sugg)
}
const followuser = async(req,res)=>{
  await friends.updateOne({user : req.params.username},{$push: {followers : req.data.username}}) 
  res.status(200).json('started following')
}
const unfollowuser = async(req,res)=>{
 await friends.updateOne({user : req.data.username},{$pull: {followers : req.params.username}}) 
 res.status(200).json('started unfollowing')
}
module.exports={
	send_friend_req,
	get_friend_req,
	approve_friend_req,
	reject_friend_req,
	get_friends,
	remove_friend,
  get_friend_sugg,
  followuser,
  unfollowuser,
  pre
}

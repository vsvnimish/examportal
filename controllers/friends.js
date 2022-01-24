require('dotenv').config();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userdb = require('../services/userdb')
const friends = require('../models/friends')
const friends_db = require('../models/friends')
const user_schema=require('../models/users').User_schema
console.log('friend')
const pre = async (req,res,next) =>{
  console.log(req.params)
   const target_userid = req.params.userid
     const sender_id = req.data._id 
     const data1= await friends_db.findOne({user : sender_id})
     const data2= await friends_db.findOne({user : target_userid})
     // console.log('after->',target_userid)
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
    next()    
}
const send_friend_req = async (req,res) => {
    await friends.updateOne({user : req.params.userid }, { $push: { requested_friends : req.data._id } })
    res.status(200).json({msg : "request sent"})
} 
const get_friend_req = async(req,res) =>{
    const data = await friends.findOne({user : req.data._id})
    res.status(200).json(data.requested_friends)
}
const approve_friend_req = async(req,res) =>{
    await friends.updateOne({user : req.data._id},{$pull: {requested_friends : req.params.userid }}) 
    await friends.updateOne({user : req.data._id},{$push: {friends : req.params.userid}}) 
    await friends.updateOne({user : req.params.userid},{$push: {friends : req.data._id }}) 
    res.status(200).json('aprroved')
}
const reject_friend_req= async(req,res) =>{
    await friends.updateOne({user : req.data.id},{$pull: {requested_friends : req.params.id }}) 
    res.status(200).json('rejected')
}
const get_friends = async(req,res) =>{
    const data = await friends.findOne({user : req.data._id})
    res.status(200).json(data.friends)
}
const remove_friend = async(req,res) =>{
    await friends.updateOne({user : req.data._id},{$pull: {friends : req.params.userid}}) 
    await friends.updateOne({user : req.params.userid},{$pull: {friends :  req.data._id }}) 
    res.status(200).json('removed')
}
const get_friend_sugg = async(req,res) =>{
    const friends_list = await friends.findOne({user : req.data._id},(err,data)=>res.status(200).json({error_msg : err}))
    const users_list = await userdb.find_user({_id : req.data._id},(err,data)=>res.status(200).json({error_msg : err}))
    const sugg_list = await userdb.find_user({loc : users_list.loc},(err,data)=>res.status(200).json({error_msg : err}))
    const new_sugg_list=sugg_list.filter((user)=>{
       return !friends_list.friends.find(element => element==user._id)
    }).map((user)=>{ return user._id;})
    res.status(200).json(new_sugg_list)
}
const followuser = async(req,res)=>{
      await friends.updateOne({user : req.data._id},{$push: {followers : req.params.userid}}) 
      res.status(200).json('started following')
}
const unfollowuser = async(req,res)=>{
     await friends.updateOne({user : req.data._id},{$pull: {followers : req.params.userid}}) 
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
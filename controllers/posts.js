require('dotenv').config();
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userdb = require('../services/userdb')
const friends = require('../models/friends')
const posts = require('../models/posts')
const user_schema=require('../models/users').User_schema
const help = require('../helpers/help.js')
const likes = require('../models/likes')
const comments = require('../models/comment')
const {v4 : uuidv4 }= require('uuid')
const reply_commentschema=require('../models/reply_comment')
// const posts =require('../models/posts')
console.log('friend')
const create_post=async(req,res)=>{
   const post={
    _id : uuidv4(),
    user : req.data.username,
    img: req.body.img,
    description : req.body.description,
    acess : req.body.acess
   }
   var newf=new posts(post)
   await newf.save()
   return res.status(200).json("created post succesfully")
}
const update_post=async(req,res)=>{
  await posts.updateOne({_id : req.params.id},{description : req.body.description})
  console.log("jo")
  return res.status(200).json("updated succesfully")
}
const delete_post =async(req,res)=>{
  await posts.deleteMany({_id : req.params.id})
  return res.status(200).json("deleted succesfully")
}
const get_post = async(req,res) =>{
  var temp
  const frndlist = await friends.findOne({user : req.data.username})
  var f = await frndlist.friends.map((userk)=>{return {"user":userk}})
  const pgsize=req.body.pagesize
  const pgno=req.body.pgno
  const data = await posts.find({$or : [...f,{"acess" : "all"},{"user" : req.data.username}]}).skip((pgno-1)*pgsize).limit(pgsize)
  const like_data = await likes.find()
  const val =await  data.map((user)=> {
     temp=like_data.filter((liker)=>{
      return user._id==liker._id
     })
     return {
       "img" : user.img,
       "description" : user.description,
       "created_by" : user.user,
       "number of likes" : temp[0].likes.length,
       "liked by" : temp[0].likes[0]+" and others"
    }
  })
  res.status(200).json(val)
}

const like_post = async(req,res) =>{
  const data = await likes.findOne({_id : req.params.id})
  if(!data){
        const lp={
          _id : req.params.id,
          likes : [],
          unlikes : []
       }
      var newf=new likes(lp)
      await newf.save()
  }
  var found=null
  try{
     found = data.likes.find(element => element == req.data.username);
  }
  catch{
    found = null;
  }
  if(!found){
     console.log(req.params.id)
     await likes.updateOne({_id : req.params.id},{$push : {likes : req.data.username}})
  }
  return res.status(200).json("liked succesfully")
}
const unlike_post = async(req,res) =>{
  const data = await likes.findOne({_id : req.params.id})
  var found
   if(!data){
        const lp={
          _id : req.params.id,
          likes : [],
          unlikes : []
       }
      var newf=new likes(lp)
      await newf.save()
  }
  try{
      found = data.unlikes.find(element => element == req.data.username);
  }
  catch{
    found=null;
  }

  if(!found)
     await likes.updateOne({_id : req.params.id},{$push : {unlikes : req.data.username}})
  return res.status(200).json("unliked succesfully")
}
const create_comment = async (req,res)=>{
    const comment={
    _id : uuidv4(),
    user : req.data.username,
    text : req.body.text,
    postid : req.params.id
   }
   var newf=new comments(comment)
   await newf.save()
   return res.status(200).json("commented");
}
const delete_comment = async(req,res)=>{
  const data = await comments.findOne({_id : req.params.id})
  if(data.user==req.data.username){
    await comments.deleteMany({_id : req.params.id})
    return res.status(200).json("deleted succesfully")
  }
  else{
    return res.status(200).json("cannot delete")
  }
}
const update_comment = async(req,res)=>{
  const data = await comments.findOne({_id : req.params.id})
  if(data.user==req.data.username){
    await comments.updateOne({_id : req.params.id},{text : req.body.text})
    return res.status(200).json("updated succesfully")
  }
  else{
    return res.status(200).json("cannot update")
  }
}

const get_comment = async(req,res)=>{
  const pgsize=req.body.pagesize
  const pgno=req.body.pgno
  const data = await comments.find({_id : req.params.id,acess : "all"}).skip((pgno-1)*pgsize).limit(pgsize)
  const val = data.map((commenter)=> {return {
       "username" : commenter.user,
       "comment" : commenter.text
  }})
  res.status(200).json(val)
}

const reply_comment = async(req,res)=>{
   const reply_c={
    _id : uuidv4(),
    user : req.data.username,
    comment_id : req.params.id,
    text : req.body.text
   }
   var newf=new reply_commentschema(reply_c)
   await newf.save()
   return res.status(200).json("replied")
}

const feed = async(req,res)=>{
  const pgno=req.body.pgno
  const pgsize=req.body.pagesize
  const data = await friends.findOne({user : req.data.username})
  const val = data.friends.map((user)=>{
    return {
      user : user
    }
  })
  const dat = await posts.find({$or : val}).skip((pgno-1)*pgsize).limit(pgsize)
  const value = dat.map((user)=> {return {
       "img" : user.img,
       "description" : user.description,
       "created_by" : user.user
  }})
  res.status(200).json(value)
}

module.exports={
  create_post,
  update_post,
  delete_post,
  get_post,
  like_post,
  unlike_post,
  create_comment,
  update_comment,
  delete_comment,
  get_comment,
  reply_comment,
  feed
}

require('dotenv').config();
var crypto = require('crypto');
const {v4 : uuidv4 }= require('uuid')
const currentdate=new Date()
const create_obj = require('../helpers/help.js').create_object
const help = require('../helpers/help.js')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const room_schema=require('../models/room')
const create_room = async(req,res)=>{
  const roomcode = await help.getCode()
  // console.log('room->',roomcode)
  const obj={
  	roomid : uuidv4(),
    roomname : req.body.roomname,
    roomadmin : req.data.username,
    roomcode : roomcode,
    users : []
  }
  var newroom=new room_schema(obj)
  await newroom.save()
  return res.status(200).json({"msg" : "room has been created sucessfully","roomcode" : roomcode})
}
const join_room = async(req,res)=>{
	const data = await room_schema.findOne({roomcode : req.body.roomcode})
	await room_schema.updateOne({roomcode : req.body.roomcode},{$push : {users : req.data.username}})
    if(data){
       return res.status(200).json("joined room")
    }
    else{
      return res.status(200).json("code doesn't exist")
    }

}
module.exports={
	create_room,
	join_room
}

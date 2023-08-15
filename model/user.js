const Joi = require('joi');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const config = require('config');

var userJoi = Joi.object({
    fbId : Joi.string().required(),
    userName: Joi.string().required(),
    avatar: Joi.string(),
    email:Joi.string(),
    phone:Joi.string(),
    role:Joi.number().min(1).max(3).required(),
});

const userSchema = new mongoose.Schema({
    fbId :{
        type:String,
        required:true,
        trim:true,
    },
    userName: {
        type:String,
        required:true,
    },
    avatar: {
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    phone:{
        type:String,
        required:false,
    },
    role:{
        type:Number,
        required:true,
        min:1,
        max:3
    },
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ fbId: this.fbId,role:this.role },config.get("jwtPrivateKey"));
    return token;
}

var User = mongoose.model("User", userSchema);

function validateUserJoi(body){
    return userJoi.validate(body);
}

exports.User = User;
exports.validateUserJoi = validateUserJoi;
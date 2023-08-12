const Joi = require('joi');
const mongoose = require("mongoose");

var contentJoi = Joi.object({
    myanmar:Joi.string().required(),
    thai:Joi.string().required(),
    pronuncation:Joi.string().required(),
    image:Joi.string().required(),
    audio:Joi.string().required(),
    classId:Joi.string().required(),
    levelId:Joi.string().required(),
    lessonId:Joi.string().required(),
});

var schema = new mongoose.Schema({
    myanmar:{
        type:String,
        required:true,
    },
    thai:{
        type:String,
        required:true,
    },
    pronuncation:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
        trim:true,
    },
    audio:{
        type:String,
        required:true,
        trim:true,
    },
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ClassScope",
        required:true,
    },
    levelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Level",
        required:true,
    },
    lessonId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lesson",
        required:true,
    },
});

var Content = mongoose.model("Content",schema);

function validateContent(body){
    return contentJoi.validate(body);
}

module.exports.Content = Content;
module.exports.validateContent = validateContent;


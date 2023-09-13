const Joi = require("joi");
const mongoose = require("mongoose");

var questionJoi = Joi.object({
    contentId:Joi.string().optional(),
    question:Joi.string().optional(),
    audioUrl:Joi.string().optional(),
    choiceItems:Joi.array().min(2).required(),
    answer:Joi.string().required(),
    qestionType:Joi.string().required(),
    classId:Joi.string().required(),
    levelId:Joi.string().required(),
    lessonId:Joi.string().required(),
});

var schema = new mongoose.Schema({
    contentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Content",
        required:false,
    },
    question:{
        type:String,
        required:false,
    },
    audioUrl:{
        type:String,
        required:false,
    },
    choiceItems:{
        type:mongoose.Schema.Types.Array,
        of:String,
        min:2,
        required:true,
    },
    answer:Joi.string().required(),
    qestionType:Joi.string().required(),
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

var Question = mongoose.model("Question",schema);

function validateQuestion(body){
    return questionJoi.validate(body);
}

exports.Question = Question;
exports.validateQuestion = validateQuestion;
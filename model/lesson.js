const Joi = require('joi');
const mongoose = require('mongoose');

var lessonJoi = Joi.object({
    name:Joi.string().required(),
    image:Joi.string().required(),
    classId:Joi.string().required(),
    levelId:Joi.string().required(),
});

var schema = new mongoose.Schema({
    name:{
        type:String,
        maxlength:256,
        minlength:5,
        required:true,
    },
    image:{
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
    }
});

var Lesson = mongoose.model("Lesson",schema);

function validateLessonJoi(body){
    return lessonJoi.validate(body);
}

exports.validateLessonJoi = validateLessonJoi;
exports.Lesson = Lesson;
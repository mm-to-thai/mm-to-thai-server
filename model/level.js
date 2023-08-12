const Joi = require('joi');
const { default: mongoose } = require('mongoose');

var levelJoi = Joi.object({
    name: Joi.string().required(),
    image:Joi.string().required(),
    classId:Joi.string().required(),
});

var schema = new mongoose.Schema({
    name:{
        type:String,
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
    }
});

var Level = mongoose.model("Level",schema);

function validateLevelJoi(body){
    return levelJoi.validate(body);
}

exports.Level = Level;
exports.validateLevelJoi = validateLevelJoi;
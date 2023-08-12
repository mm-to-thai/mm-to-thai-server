const Joi = require("joi");
const mongoose  = require("mongoose");

var classScopeJoi = Joi.object({
    name:Joi.string().max(256).required(),
});

var mongooseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
});

var ClassScope = mongoose.model("ClassScope",mongooseSchema);

function validateClassScopeJoi(body){
    return classScopeJoi.validate(body);
}

exports.ClassScope = ClassScope;
exports.validateClassScopeJoi = validateClassScopeJoi;
const express = require("express");
var {ClassScope,validateClassScopeJoi} = require("../model/class_scope");

var router = express.Router();

router.get("/",async(req,res) =>{
   const classscopes = await ClassScope
   .find()
   .limit(10)
   .sort({ _id: 1});
   return res.status(200).send(classscopes);
});

router.post("/",async(req,res) => {
     //check req.body is valid
     var { error } = validateClassScopeJoi(req.body);
     if(error) return res.status(400).send(error.details[0].message);
    //if valid,we save mongoose
    ClassScope.create(req.body)
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

module.exports.classScope = router;
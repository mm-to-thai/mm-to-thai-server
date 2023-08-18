const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
var {ClassScope,validateClassScopeJoi} = require("../model/class_scope");

var router = express.Router();

/* router.use(auth); */

router.get("/count",async(req,res) =>{
   const result = await ClassScope
   .find().count();
   return res.status(200).send({"count":result});
});

router.get("/",async(req,res) =>{
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    const searchValue = req.query.name;
    const pattern = searchValue == undefined ? new RegExp('.*John.*', 'i') : new RegExp(`.*${searchValue}.*`, 'i');
   const classscopes = searchValue != undefined ? 
   await ClassScope
   .find({ name: pattern })
   .skip(page * limit)
   .limit(limit)
   .sort({ _id: 1}) 
   : 
   await ClassScope
   .find()
   .skip(page * limit)
   .limit(limit)
   .sort({ _id: 1});
   const count = await ClassScope
   .find().count();
   const data = {
    "count":count,
    "data":classscopes
   };
   return res.status(200).send(data);
});

///Get Specific Class
router.get("/:id",async(req,res) => {
    const classscope = await ClassScope
    .findOne({_id:req.params.id});
    return res.status(200).send(classscope);
 });

router.post("/",[auth,admin],async(req,res) => {
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


///Update ClassScope
router.put("/:id",[auth,admin],async(req,res) => {
    var classscope = await ClassScope.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true });
    return res.status(200).send(classscope);});

    //Delete ClassScope
router.delete("/:id",[auth,admin],async(req,res) => {
    ClassScope.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});

module.exports.classScope = router;
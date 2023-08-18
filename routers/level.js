const express = require("express");
const {Level,validateLevelJoi} = require("../model/level");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

var router = express.Router();


router.get("/count",async(req,res) =>{
    const result = await Level.find().count();
    return res.status(200).send({"count":result});

 });

router.get("/",async(req,res) => {
    //Get Levels By Class ID
    const id = req.query.classId;
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    const searchValue = req.query.name;
    const pattern = searchValue == undefined ? new RegExp('.*John.*', 'i') : new RegExp(`.*${searchValue}.*`, 'i');
    if(id){
        const levels = await Level.find({
            classId: id
        })
        .populate("classId","name")
        .skip(page * limit)
        .limit(limit)
        .sort({_id:1});
        const count = await Level.find({
            classId: id
        }).count();
        var data = {
            "count":count,
            "data": levels
        };
        return res.status(200).send(data);
    }

   //Get All
   const levels = searchValue == undefined ?
    await Level.find()
   .populate("classId","name")
   .skip(page * limit)
   .limit(limit)
   .sort({ _id: 1}) : await Level.find({name:pattern})
   .populate("classId","name")
   .skip(page * limit)
   .limit(limit)
   .sort({ _id: 1});
   const count = await Level.find().count();
    var data = {
        "count":count,
        "data": levels
    };
   return res.status(200).send(data);
});


///Get Levels By Class ID
/* router.get("/",async(req,res) => {
    const id = req.query.classId;
    console.log(`Class Id: ${id}`)
    const levels = await Level.find({
        classId: id
    })
    .limit(10)
    .sort({_id:1});
    return res.status(200).send(levels);
}); */

///Get Specific Level
router.get("/:id",async(req,res) => {
    const level = await Level
    .findOne({_id:req.params.id})
    .populate("classId","name");
    return res.status(200).send(level);
 });


 ///Add new Level Object
router.post("/",[auth,admin],async(req,res) => {
    var { error } = validateLevelJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let newLevel = new Level(req.body);
    newLevel.save()
    .then((result) => {
        Level.populate(newLevel,"classId")
        .then((level) => {
            return res.status(200).send(level);
        });
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

///Update Level
router.put("/:id",[auth,admin],async(req,res) => {
    var level = await Level.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true }).populate("classId");
    return res.status(200).send(level);
    /* //find Level with given id
    var level = await Level.findOne({_id:req.params.id}).populate("classId");
    //if not exsit,404
    if(!level) return res.status(404).send("The Level with the given id is not found.");
    //if exist,validate req.body
    level.name = req.body.name == undefined ? level.name : req.body.name;
    level.image = req.body.image == undefined ? level.image : req.body.image;
    level.classId = req.body.classId == undefined ? level.classId : req.body.classId;
    //update and return
    level.save()
    .then(async(result) => {
        var level = await Level.findOne({_id:req.params.id}).populate("classId")
        return res.status(200).send(level);
    }).catch((err) => {
        return res.status(400).send(err);
    }); */
});

//Delete Level
router.delete("/:id",[auth,admin],async(req,res) => {
    Level.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});


module.exports.level = router;
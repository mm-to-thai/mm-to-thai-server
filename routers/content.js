const express = require("express");
var { Content,validateContent } = require("../model/content");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

var router = express.Router();

router.get("/count",async(req,res) =>{
    const result = await Content.find().count();
    return res.status(200).send({"count":result});

 });
///Get All Content
router.get("/",async(req,res) => {
    const classId = req.query.classId;
    const levelId = req.query.levelId;
    const lessonId = req.query.lessonId;
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    const searchValue = req.query.name;
    const pattern = searchValue == undefined ? new RegExp('.*John.*', 'i') : new RegExp(`.*${searchValue}.*`, 'i');
    if(classId && levelId && lessonId){

        const contents = await Content.find({
            classId:classId,
            levelId:levelId,
            lessonId:lessonId,
        })
    .populate("classId levelId lessonId","name")
    .skip(limit * page)
    .limit(limit)
    .sort({_id:1});
    const count = await Content.find({
        classId:classId,
        levelId:levelId,
        lessonId:lessonId,
    }).count();
    const data = {
        "count": count,
        "data":contents
    };
    return res.status(200).send(data);
    }
    const contents = searchValue == undefined ?
     await Content.find()
    .populate("classId levelId lessonId","name")
    .skip(limit * page)
    .limit(limit)
    .sort({_id:1}) :  await Content.find({ myanmar:pattern })
    .populate("classId levelId lessonId","name")
    .skip(limit * page)
    .limit(limit)
    .sort({_id:1});
    const count = await Content.find().count();
    const data = {
        "count": count,
        "data":contents
    };
    return res.status(200).send(data);
});

///Get Specific Content
router.get("/:id",async(req,res) => {
    const content = await Content
    .findOne({_id:req.params.id})
    .populate("classId levelId lessonId","name");
    return res.status(200).send(content);
 });

///Create Content
router.post("/",[auth,admin],async(req,res) => {
    var { error } = validateContent(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let newContent = new Content(req.body);
    newContent.save()
    .then((result) => {
        result.populate("classId levelId lessonId","name")
        .then((question) => {
            return res.status(200).send(question);
        });
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

///Update Content
router.put("/:id",[auth,admin],async(req,res) => {
    var content = await Content.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true }).populate("classId levelId lessonId","name");
    return res.status(200).send(content);});

    //Delete Content
router.delete("/:id",[auth,admin],async(req,res) => {
    Content.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});
exports.content = router;
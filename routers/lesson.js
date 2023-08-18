const express = require('express');
var { Lesson,validateLessonJoi } = require("../model/lesson");
var router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


///Get All Lesson
router.get("/",async(req,res) => {
    const classId = req.query.classId;
    const levelId = req.query.levelId;
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    const searchValue = req.query.name;
    const pattern = searchValue == undefined ? new RegExp('.*John.*', 'i') : new RegExp(`.*${searchValue}.*`, 'i');
    if(classId && levelId){

        const lessons = await Lesson.find({
            classId:classId,
            levelId:levelId
        })
    .populate("classId levelId","name")
    .skip(page * limit)
    .limit(limit)
    .sort({_id:1});
    const count = await Lesson.find({
        classId:classId,
        levelId:levelId
    }).count();
    const data = {
        "count": count,
        "data":lessons
    };
    return res.status(200).send(data);
    }
    const lessons = searchValue == undefined ?
     await Lesson.find()
    .populate("classId levelId","name")
    .skip(limit * page)
    .limit(limit)
    .sort({_id:1}) : await Lesson.find({ name:pattern})
    .populate("classId levelId","name")
    .skip(limit * page)
    .limit(limit)
    .sort({_id:1});
    const count = await Lesson.find().count();
    const data = {
        "count": count,
        "data":lessons
    };
    return res.status(200).send(data);
});

router.get("/count",async(req,res) =>{
    const result = await Lesson.find().count();
    return res.status(200).send({"count":result});

 });
///Get Specific Lesson
router.get("/:id",async(req,res) => {
    const lesson = await Lesson
    .findOne({_id:req.params.id})
    .populate("classId levelId","name");
    return res.status(200).send(lesson);
 });

///Lesson Create
router.post("/",[auth,admin],async(req,res) =>{
    var { error } = validateLessonJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let newLesson = new Lesson(req.body);
    newLesson.save()
    .then((result) => {
        result.populate("classId levelId","name")
        .then((question) => {
            return res.status(200).send(question);
        });
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

///Update Lesson
router.put("/:id",[auth,admin],async(req,res) => {
    var lesson = await Lesson.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true }).populate("classId levelId");
    return res.status(200).send(lesson);});

    //Delete Lesson
router.delete("/:id",[auth,admin],async(req,res) => {
    Lesson.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});

module.exports.lesson = router;
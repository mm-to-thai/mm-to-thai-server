const express = require('express');
var { Lesson,validateLessonJoi } = require("../model/lesson");
var router = express.Router();


///Get All Lesson
router.get("/",async(req,res) => {
    const classId = req.query.classId;
    const levelId = req.query.levelId;
    if(classId && levelId){

        const lessons = await Lesson.find({
            classId:classId,
            levelId:levelId
        })
    .populate("classId levelId","name")
    .limit(10)
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
    const lessons = await Lesson.find()
    .populate("classId levelId","name")
    .limit(10)
    .sort({_id:1});
    const count = await Lesson.find().count();
    const data = {
        "count": count,
        "data":lessons
    };
    return res.status(200).send(data);
});

///Get Specific Lesson
router.get("/:id",async(req,res) => {
    const lesson = await Lesson
    .findOne({_id:req.params.id})
    .populate("classId levelId","name");
    return res.status(200).send(lesson);
 });

///Lesson Create
router.post("/",async(req,res) =>{
    var { error } = validateLessonJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    Lesson.create(req.body)
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

///Update Lesson
router.put("/:id",async(req,res) => {
    var lesson = await Lesson.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true }).populate("classId levelId");
    return res.status(200).send(lesson);});

    //Delete Lesson
router.delete("/:id",async(req,res) => {
    Lesson.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});

module.exports.lesson = router;
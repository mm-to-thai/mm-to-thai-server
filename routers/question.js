const express = require("express");
var { Question,validateQuestion } = require("../model/question");

var router = express.Router();

///Get All Content
router.get("/",async(req,res) => {
    const classId = req.query.classId;
    const levelId = req.query.levelId;
    const lessonId = req.query.lessonId;
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    if(classId && levelId && lessonId){

        const questions = await Question.find({
            classId:classId,
            levelId:levelId,
            lessonId:lessonId,
        })
    .populate("classId levelId lessonId","name")
    .populate("contentId")
    .skip(page * limit)
    .limit(limit)
    .sort({_id:1});
    const count = await Question.find({
        classId:classId,
        levelId:levelId,
        lessonId:lessonId,
    }).count();
    const data = {
        "count": count,
        "data":questions
    };
    return res.status(200).send(data);
    }
    const questions = await Question.find()
    .populate("classId levelId lessonId","name")
    .populate("contentId")
    .skip(page * limit)
    .limit(limit)
    .sort({_id:1});
    const count = await Question.find().count();
    const data = {
        "count": count,
        "data":questions
    };
    return res.status(200).send(data);
});

///Get Specific Question
router.get("/:id",async(req,res) => {
    const question = await Question
    .findOne({_id:req.params.id})
    .populate("classId levelId lessonId","name")
    .populate("contentId");
    return res.status(200).send(question);
 });

///Create Question
router.post("/",async(req,res) => {
    var { error } = validateQuestion(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    Question.create(req.body)
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

///Update Question
router.put("/:id",async(req,res) => {
    var question = await Question.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{ new : true })
    .populate("classId levelId lessonId","name")
    .populate("contentId")
    ;
    return res.status(200).send(question);});

    //Delete Question
router.delete("/:id",async(req,res) => {
    Question.deleteOne({_id:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});

exports.question = router;
const express = require('express');
var { Lesson,validateLessonJoi } = require("../model/lesson");
var router = express.Router();

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

module.exports.lesson = router;
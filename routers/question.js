const express = require("express");
var { Question,validateQuestion } = require("../model/question");

var router = express.Router();

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

exports.question = router;
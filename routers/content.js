const express = require("express");
var { Content,validateContent } = require("../model/content");

var router = express.Router();

router.post("/",async(req,res) => {
    var { error } = validateContent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    Content.create(req.body)
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

exports.content = router;
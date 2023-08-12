const express = require("express");
const {Level,validateLevelJoi} = require("../model/level");

var router = express.Router();

router.get("/",async(req,res) => {
    return res.status(200).send("Welcome to Level");
});

router.post("/",async(req,res) => {
    var { error } = validateLevelJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    Level.create(req.body)
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
});

module.exports.level = router;
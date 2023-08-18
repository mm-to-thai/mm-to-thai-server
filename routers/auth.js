const express = require('express');
const { User,validateUserJoi } = require("../model/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

var router = express.Router();

router.get("/count",async(req,res) =>{
    const result = await User.find().count();
    return res.status(200).send({"count":result});

 });
///Get All User
router.get("/",async(req,res) => {
    var page = req.query.page == undefined ? 0 : req.query.page;
    var limit = req.query.limit == undefined ? 10 : req.query.limit;
    const searchValue = req.query.name;
    const pattern = searchValue == undefined ? new RegExp('.*John.*', 'i') : new RegExp(`.*${searchValue}.*`, 'i');
    const users = searchValue == undefined ? await User.find()
    .skip(page * limit)
    .limit(limit)
    .sort({_id:1}) : await User.find({ userName:pattern })
    .skip(page * limit)
    .limit(limit)
    .sort({_id:1});
    const count = await User.find().count();
    const data = {
        "count": count,
        "data":users
    };
    return res.status(200).send(data);
});

///Get Specific User
router.get("/:id",async(req,res) => {
    const user = await User
    .findOne({fbId:req.params.id});
    return res.status(200).send(user);
 });

//Create User
router.post("/register",async(req,res) => {
    //validate req.body with joi
    const { error } = validateUserJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //check use is already login or not by req.body.fbId
    //if exist return already registered.
    let user = await User.findOne({ fbId: req.body.fbId });
    if(user) return res.status(400).send("User already registered.");
    
    //if not save user and return
    User.create(req.body)
    .then((result) => {
        const token = result.generateAuthToken();
        res.setHeader("Access-Control-Expose-Headers","*");
    return res.status(200).header({'x-auth-token': token}).send(result);

    }).catch((err) => {
        return res.status(400).send(err);
    });
});

router.post("/login",async(req,res) => {
    //validate req.body with joi
    const { error } = validateUserJoi(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //if user not exist,we send first need to register
    let user = await User.findOne({ fbId: req.body.fbId });
    if(!user) return res.status(400).send("Not found given user.Please register first!.");
    
    //if use is exist we need to return jwt token
    const token = user.generateAuthToken();
    res.setHeader("Access-Control-Expose-Headers","*");

    return res.status(200).header({'x-auth-token': token}).send(user);
});

router.put("/:id",auth,async(req,res) => {
    var user = await User.findOne({fbId:req.params.id});
    user.userName = req.body.userName == undefined ?
    user.userName : req.body.userName;
    user.avatar = req.body.avatar == undefined ? user.avatar : req.body.avatar;
    user.email = req.body.email == undefined ? user.email : req.body.email;
    user.phone = req.body.phone == undefined ? user.phone : req.body.phone;
    user.role = req.body.role == undefined ? user.role : req.body.role;
    user.save()
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err);
    });
    
});

   //Delete Lesson
   router.delete("/:id",[auth,admin],async(req,res) => {
    User.deleteOne({fbId:req.params.id})
    .then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(400).send(err); 
    });
});

module.exports.auth = router;
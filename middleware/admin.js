module.exports = function(req,res,next){
    if(req.user.role != 3) return res.status(403).send("Access denied.You are not an admin.");

    next();
}
const express  = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const {classScope} = require("./routers/class_scope");
const {level} = require("./routers/level");
const {lesson} = require("./routers/lesson"); 
const {content} = require("./routers/content");
const {question} = require("./routers/question");
const {auth} = require("./routers/auth");
const { corsOptions } = require("./middleware/cors_options");

if(!config.get("jwtPrivateKey")){
    console.log("JWTPrivateKey is not defined");
    process.exit(1);
}

const db = config.get("db");
mongoose.connect(db)
.then((result) => {
    console.log(`Mongodb is connected to ${db}....`);
}).catch((err) => {
    console.log(`Mongodb connecting error: ${err}`,);
});

const app = express();
require("./middleware/prod")(app);
app.use(cors());
app.use(express.json());
app.use("/api/classscopes",classScope);
app.use("/api/levels",level);
app.use("/api/lessons",lesson);
app.use("/api/contents",content);
app.use("/api/questions",question);
app.use("/api/auth",auth);

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log("Listening on port 3000....");
});
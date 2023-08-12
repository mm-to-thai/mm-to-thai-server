const express  = require("express");
const mongoose = require("mongoose");
const {classScope} = require("./routers/class_scope");
const {level} = require("./routers/level");
const {lesson} = require("./routers/lesson"); 
const {content} = require("./routers/content");
const {question} = require("./routers/question");

mongoose.connect('mongodb://127.0.0.1:27017/mm_to_th')
.then((result) => {
    console.log("Mongodb is connected....");
}).catch((err) => {
    console.log(`Mongodb connecting error: ${err}`,);
});

const app = express();

app.use(express.json());
app.use("/api/classscopes",classScope);
app.use("/api/levels",level);
app.use("/api/lessons",lesson);
app.use("/api/contents",content);
app.use("/api/questions",question);

app.listen(3000,() => {
    console.log("Listening on port 3000....");
});
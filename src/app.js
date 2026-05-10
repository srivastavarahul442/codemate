const express = require('express');
const app = express();
const port = 7070;

app.use("/user", (req, res, next) => {
    console.log("request Handler 1");
    // res.send("fetch data successfully 1")
    next();
},
    (req, res) => {
        console.log("request Handler 2");
        res.send("fetch data successfully 2")
    })




app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
})
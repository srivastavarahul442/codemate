const express = require('express');
const app = express();
const port = 7070;

app.use("/test",(req,res)=>{
    res.send("Hello from test route");
})

app.use("/hello",(req,res)=>{
    res.send("Hello from hello route");
})

app.use("/",(req,res)=>{
    res.send("Hello world");
})



app.listen(port,()=>{
    console.log(`server is running on port no ${port}`);
})
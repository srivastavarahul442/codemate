const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://NamasteDev:hr7ShhjB8RIOdb6u@namastenode.fnko7.mongodb.net/codemate")
}


module.exports = connectDB;
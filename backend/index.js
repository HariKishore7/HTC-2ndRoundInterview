const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const bodyparser = require("body-parser");

app.use(express.json());
app.use(bodyparser,{useUnifiedTopology: true, useNewUrlParser: true });
app.use(cors());
const db = mongoose.createConnection("mongodb://localhost:27017");
const loginSchema = mongoose.Schema({
    employeeId: String,
    username: String,
    password: String
})

const employeeSchema = mongoose.Schema({
    employeeId: Number,
    name: String,
    age: Number,
    email: String,
    mobile: Number,
    address: String,
    role: String
})

const loginModel = db.model("login",loginSchema);
const employeeModel = db.model("employee",employeeSchema);

app.post('/signIn', async (req,res)=>{
    const {username, password} = req.body;
    try{
        if(loginModel.findOne({username})){
            res.send(err=` ${username} already Exists`);
    
        }
        else{
            const hashedPassword = bcrypt.hashSync(password);
            const newUser = new loginModel({username,hashedPassword});
            await newUser.save();
        }
    }
    catch(err){
        res.send(err);
    }

})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const isUserNamePresent = loginModel.findOne({username});
    try{
        if(isUserNamePresent){
            const hashedPassword = bcrypt.compareSync(password);
            if(hashedPassword==isUserNamePresent.hashedPassword){
                res.send(username);
            }
            else{
                res.send("Password is incorrect");
            }
        }
        else{
            res.send("No userName is present");
        }
    }
    catch(err){
        res.send(err);
    }
})

app.post('/userdetails',async (req,res)=>{
    const {employeeId,username, DOB, Gender, Qualification, Email, Skills} = req.body;
    const newEmployee = new employeeModel({employeeId,username, DOB, Gender, Qualification, Email, Skills});
    await newEmployee.save();
})

app.get('/userdetails',async (req,res)=>{
    const employeeDetails = employeeModel.findById({employeeId});
    res.send(employeeDetails);
})

app.listen(9000,()=>console.log("sever started...."));
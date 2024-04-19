const express = require("express");
const mongoose = require("mongoose");

const PORT = 5000;
const AuthController = require("./controller/authController")

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'Get, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-access-token, Authorization');
    next();
});

const db = mongoose.connect(process.env.MONGODB_URL);

app.use("/auth", AuthController)

if(db) {
    app.listen(PORT, () => {
        console.log("Server is connected")
        console.log('Database is connected');
    })
}



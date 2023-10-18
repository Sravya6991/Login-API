const express = require("express")
const PORT = 5000
const db = require("./db");
const AuthController = require("./controller/authController")

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'Get, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-access-token, Authorization');
    next();
});

app.use("/auth", AuthController)

app.listen(PORT, () => {
    console.log("Server is connected")
})


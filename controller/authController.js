// const db = require("./db");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const config = require("../config");

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

router.post("/register", (req, res) => {
    let hashpassword = bcrypt.hashSync(req.body.password, 8)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role ? req.body.role : "user"
    });
    (err, result) => {
        if(err) {
            console.log("error while registering")
        } 
        console.log(result)
        res.send("registered successfully")
    }
});

router.post("/login", (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) return res.send({auth: false, token: "error while login"});
        if(!user) return res.send({auth: false, token: "Invalid user credentials"});
        else {
            const passValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passValid){
                return res.send({auth: false, token: "Invalid credentials"});
            }
            let token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400 // 24 hr == 86400sec
            })
            console.log(passValid);
            res.send({auth: true, token: token});
        }
    });
})

router.get("/users", (req, res) => {
    User.find({}, (err,data) => {
        if(err) return res.send(err)
        res.send(data)
    })
});

// get particular user
router.get("/userInfo", (req, res) => {
    let token = req.headers["x-access-token"]
    console.log(token)
    if(!token) res.send({auth: false, token: "No token provided"});

    // jwt verify
    jwt.verify(token, config.secret, (err, user)=> {
        console.log(user)
        if(err) res.send({auth: false, token: "Invalid token"})
        User.findById(user.id, (err, data) => {
            if(err) throw err
            res.send(data)
        })
    })
})



module.exports = router;
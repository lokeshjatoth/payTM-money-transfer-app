const express = require("express"); 
const zod = require("zod")
const {User, Account} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const {authMiddleware} = require("../middleware");


const singupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup", async (req, res)=>{
    const body = req.body;
    const obj = singupSchema.safeParse(req.body);
    if(!obj.success){
        return res.status(411).json({
            message: "Email already taken / Incorrect Inputs",
        })
    }
    
    const existingUser = await User.findOne({
        username: body.username
    })
    

    if(existingUser){
        return res.json({
            message: "User already exist with this username try another username",
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName : req.body.lastName,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1+ Math.random() * 10000
    })



    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created Successfully",
        token: token,
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


router.post("/signin", async(req, res)=>{
    
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user){
        return res.json({
            message: "User not exists",
        })
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET);

    res.status(200).json({
        message: "User logged in Successfully",
        token, token
    })
})

router.get("/profile", authMiddleware, async(req,  res)=>{
    const user = await User.findOne({
        _id: req.userId
    })
    
    res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    })
})


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async(req, res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information",
        })
    }
    

    await User.updateOne(
        { _id: req.userId }, // Filter by the user's ID
        { $set: req.body }
    )

    res.json({
        message: "updated Successfully",
    })
})



router.get("/bulk", async(req, res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex" : filter
            }
        }, {
            lastName:{
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user =>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;
const express = require("express")
const router = express.Router()
const zod = require('zod')
const {User, Account} = require('../db')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')
const { authMiddleware } = require("../middleware")

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

router.post('/signup',async(req,res)=>{
   const {success} = signupBody.safeParse(req.body)
   if(!success){
    return res.status(411).json({
        message: "email already taken / incorrect inputs"
    })
   }
   const existingUser = await User.findOne({
    username: req.body.username
   })
   if(existingUser){
    return res.status(411).json({
        message: "email already taken / incorrect inputs"
    })
   }
   const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
   })
   const userId = user._id

   await Account.create({
    userId,
    balance: 1+Math.random()*10000
   })

   const token = jwt.sign({
    userId
   },JWT_SECRET)
   res.json({
    message: "user created successfully",
    token: token
   })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    lastname: zod.string().optional(),
    firstname: zod.string().optional(),
})

router.put('/',authMiddleware,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "error while updating information"
        })
    }
    await User.updateOne({
        _id: req.userId
    },req.body)
    res.status(200).json({
        message: "updated successfully"
    })
})

router.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || ""
    const users = await User.find({
        $or: [{
            firstname:{
                "$regex":filter
            }
        },{
            lastname:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user: users.map(user=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})

module.exports = router
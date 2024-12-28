const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const mongoose = require("mongoose")

const router = express.Router();

router.get("/balance", authMiddleware, async(req, res)=>{
    
    const account = await Account.findOne({
        userId : req.userId
    });

    res.json({
        balance : account.balance
    })
})

/*  //bad code
router.post("/transfer", authMiddleware, async(req, res)=>{
    const {amount, to} = req.body;

    const account = await Account.findOne({
        userId: req.userId
    });

    if(account.balance<amount){
        return res.status(400).json({
            messgae: 'Insufficient balance',
        })
    }

    const toAccount = await Account.findOne({
        userId: to,
    });

    if(!toAccount){
        return res.status(400).json({
            messgae: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId,
    },  {
        $inc: {
            balance: -amount,
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount,
        }
    })
})

*/


//good code

router.post("/transfer", authMiddleware, async(req, res)=>{
    try{
        const session = await mongoose.startSession();

        session.startTransaction();
        const {amount, to} = req.body;
        
        const account = await Account.findOne({userId: req.userId}).session(session);
        

        if(!account || account.balance <amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }
        
        const toAccount = await Account.findOne({userId: to}).session(session);
        
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }
        
        //perform transfer

        await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
        await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);
        

        await session.commitTransaction();
        res.json({
            message: "Transfer Successful",
        });
    } catch(error){
        console.log(error.message);
        return res.status(411).json({
            message: "Something happened during transaction"
        })
    }
    
});


module.exports = router;
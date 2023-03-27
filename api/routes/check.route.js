const router = require("express").Router();
const createError = require("http-errors");
const User = require("../models/user.model");

const {verifyAccessToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require("../helpers/jwt.helper")


router.get('/logged-user', (req,res, next) =>{
    verifyAccessToken(req,res, async (err)=>{
        if(err) {return next(err)}
        const userId = req.payload.aud
        const user = await User.findOne({_id: userId});
        if(!user){return next(createError.Forbidden())}
        const {isAdmin, password, ...safeUserData} = user._doc
        res.status(200).json(safeUserData)
    })
})

router.get('/logged-admin', (req,res, next) =>{
    verifyAccessToken(req,res, async (err)=>{
        if(err) {return next(err)}
        const userId = req.payload.aud
        const user = await User.findOne({_id: userId});
        if(!user){return next(createError.Forbidden())}

        const {isAdmin, password, ...safeUserData} = user._doc
        res.status(200).json(isAdmin.toString())
    })
})

module.exports = router
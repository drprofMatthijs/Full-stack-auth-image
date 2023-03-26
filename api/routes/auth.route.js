const router = require("express").Router();
const createError = require("http-errors");
const User = require("../models/user.model");
const client = require('../helpers/init_redis')

const {authSchema} = require("../helpers/validation.schema");
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require("../helpers/jwt.helper")

router.post("/register", async (req,res,next) =>{
    try{
        //const {email, password} = req.body;
        //if (!email || !password){throw createError.BadRequest()}
        const result = await authSchema.validateAsync(req.body);
        
        const doesExist = await User.findOne({email: result.email});
        if (doesExist){ throw createError.Conflict(result.email + " is already registered")}

        const user = new User(result);
        const savedUser = await user.save();
        let {isAdmin, password, ...safeUserData} = savedUser._doc
        res.status(201).json(safeUserData);

    }catch(err){
        if (err.isJoi){err.status = 422}
        next(err);
    }

})

router.post("/login", async (req,res,next) =>{
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({email: result.email});
        if(!user) { throw createError.NotFound("Email is not registered")}
        const isMatch = await user.isValidPassword(result.password);
        
        if(!isMatch) {throw createError.Unauthorized('Invalid Credentials')}
        

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        
        res.cookie('accessToken', accessToken, {maxAge: 15*60*1000, httpOnly:true})
        res.cookie('refreshToken', refreshToken, {maxAge: 7*24*60*60*1000, sameSite:'strict', path:'/refresh-token', httpOnly:true})
        const {isAdmin, password, ...safeUserData} = user._doc
        res.status(200).json(safeUserData);
        
    } catch (err) {
        console.log(err.message)
        if (err.isJoi){return next(createError.BadRequest("Invalid Credentials"))}
        next(err);
    }
})

//Verify refresh token from cookie and set new access and refresh token in cookies

router.post("/refresh-token", async (req,res,next) =>{
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken){throw createError.BadRequest()}
        const userId = await verifyRefreshToken(refreshToken);
        const newAccessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);
        res.send({accessToken : newAccessToken, refreshToken: newRefreshToken})
    } catch (err) {
        next(err)
    }
})

//Get refresh token from cookie
//Delete it from redis
//Then delete cookies in browser and send http status code 204

router.delete("/logout", async (req,res,next) =>{
    try{
        const {refreshToken} = req.body;
        if(!refreshToken){throw createError.BadRequest()}
        const userId = await verifyRefreshToken(refreshToken)
        try{
            await client.del(userId)
            res.sendStatus(204)
        }
        catch(err){
            console.log(err.message)
            throw createError.InternalServerError();
        }
    }
    catch(err){
        next(err)
    }
})


module.exports = router
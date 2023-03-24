const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const client = require('./init_redis');

const signAccessToken = (userId) =>{
    return new Promise((resolve, reject) =>{
        const payload = {}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: "15m",
            issuer: process.env.MY_WEBSITE,
            audience: userId
        }
        jwt.sign(payload, secret, options, (err, token) =>{
            if(err) {
                console.log(err.message)
                return reject(createError.InternalServerError())
            }
            return resolve(token)
        })
    })
}

const verifyAccessToken = (req,res,next) =>{
    if (!req.headers.authorization){ return next(createError.Unauthorized())}
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) =>{
        if(err){
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message));
        }

        req.payload = payload;
        next()
    });
}

const signRefreshToken = (userId) =>{
    return new Promise((resolve, reject) =>{
        const payload = {}
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: "7d",
            issuer: process.env.MY_WEBSITE,
            audience: userId
        }
        jwt.sign(payload, secret, options, async (err, token) =>{
            if(err) {
                console.log(err.message)
                return reject(createError.InternalServerError())
            }
            //save token with redis with expiration time 7d
            try{
                await client.set(userId, token, {EX: 7*24*60*60})
                console.log("success saving refresh token in redis")
                return resolve(token)
            }
            catch(err){
                console.log("Error trying to save token with redis: \n"+err.message)
                return reject(createError.InternalServerError())
            }
        })
    })
}

const verifyRefreshToken = (refreshToken) =>{
    return new Promise((resolve,reject) =>{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) =>{
            if(err){return reject(createError.Unauthorized())}
            const userId = payload.aud;
            try{
                const value = await client.get(userId)
                if(refreshToken === value){
                    return resolve(userId)
                }
                else{
                    return reject(createError.Unauthorized())
                }

            }
            catch(err){
                console.log("Error trying to get token with redis: \n"+err.message)
                return reject(createError.InternalServerError())
            }

        })
    })
}

const verifyAccessCookie = (req,res,next) => {
    res.send(req.cookies)
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessCookie

}
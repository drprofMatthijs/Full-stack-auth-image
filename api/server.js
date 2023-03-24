const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const createError = require("http-errors");
const corsOptions = require('./config/corsConfig');
const cors = require('cors')
require("dotenv").config();
require("./helpers/initMongodb");
const authRoute = require('./routes/auth.route');
const {verifyAccessToken} = require("./helpers/jwt.helper");
const client = require('./helpers/init_redis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// ROUTES
app.get('/', verifyAccessToken, (req,res)=>{
    res.send("It appears that you are a safe client. Enjoy");
})
app.use('/auth',authRoute);



//ERROR HANDLERS

app.use(async (req,res,next) =>{
    next(createError.NotFound());
})

app.use((err, req, res, next) =>{
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT);
})
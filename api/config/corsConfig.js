// var whitelist = ['http://127.0.0.1:3000/']
// var corsOptions = {
//   origin:  (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//     } else {
//         callback(new Error('Not allowed by CORS'))
//     }
//   },
//   optionSuccessStatus: 200
// }

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials:true,
    exposedHeaders: ["set-cookie"]
}

module.exports = corsOptions
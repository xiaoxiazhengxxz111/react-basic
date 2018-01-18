const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')

// DB setup
mongoose.connect('mongodb://localhost:auth/auth')

// App setup: any incoming requests will pass to morgan and bodyPaser
app.use(morgan('combined'))  // log the incoming requests for debug propos
app.use(cors())
app.use(bodyParser.json({type: '*/*'})) // pase all type incoming requests to json
router(app)     //call router with app


// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, () =>{
  console.log('Server is listening on port: ', port)
})
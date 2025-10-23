const express = require("express");
const app = express()
const PORT = 3000
const rootRouter = require('./routes/index')
const cors = require('cors')

app.use(cors())//since frontend and backend are hosted on separate routes
app.use(express.json())// since we have to support json body in post requests 

app.use('/api/v1',rootRouter)


app.listen((PORT),()=>{
    console.log("server running on port:",PORT)
})
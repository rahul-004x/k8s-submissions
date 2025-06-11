const express = require('express')
const app = express()
require('dotenv').config()

// Counter to track requests
let requestCounter = 0

app.get('/pingpong', (req,res) => {
    res.json(`pong ${requestCounter}`)
    requestCounter++
})

const PORT = process.env.PORT | 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
const express = require('express')
const path = require('path')
const app = express()
require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`<h3>Welcome to the Express Server!</h3>`)
})

const port = process.env.PORT || 3000 
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
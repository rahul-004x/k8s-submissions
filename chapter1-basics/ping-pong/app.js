const express = require('express')
const app = express()
require('dotenv').config()

// In-memory counter since we're no longer using shared volumes
let counter = 0

// Function to get counter
function getCounter() {
    return counter
}

// Function to increment counter
function incrementCounter() {
    counter++
    return counter
}

app.get('/pingpong', (req,res) => {
    const currentCounter = getCounter()
    res.json(`pong ${currentCounter}`)
    incrementCounter()
    console.log(`Request ${currentCounter} processed, counter incremented to ${getCounter()}`)
})

// New endpoint to get just the counter value for other services
app.get('/counter', (req, res) => {
    const currentCounter = getCounter()
    res.json({ count: currentCounter })
    console.log(`Counter value ${currentCounter} requested`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

// Simulate periodic ping-pong activity every 10 seconds
setInterval(() => {
    incrementCounter()
    console.log(`Simulated ping-pong activity, counter now: ${getCounter()}`)
}, 10000)
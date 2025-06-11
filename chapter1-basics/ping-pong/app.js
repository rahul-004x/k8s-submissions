const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
require('dotenv').config()

// Use /shared in container, ./shared locally
const sharedPath = fs.existsSync('/shared') ? '/shared' : path.join(__dirname, 'shared')
const counterFilePath = path.join(sharedPath, 'counter.txt')

// Ensure the shared directory exists
const sharedDir = path.dirname(counterFilePath)
if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true })
}

// Initialize counter file if it doesn't exist
if (!fs.existsSync(counterFilePath)) {
    fs.writeFileSync(counterFilePath, '0')
}

// Function to read counter from file
function getCounter() {
    try {
        const content = fs.readFileSync(counterFilePath, 'utf8')
        return parseInt(content.trim()) || 0
    } catch (error) {
        console.error('Error reading counter:', error)
        return 0
    }
}

// Function to write counter to file
function setCounter(count) {
    try {
        fs.writeFileSync(counterFilePath, count.toString())
    } catch (error) {
        console.error('Error writing counter:', error)
    }
}

app.get('/pingpong', (req,res) => {
    const currentCounter = getCounter()
    res.json(`pong ${currentCounter}`)
    setCounter(currentCounter + 1)
    console.log(`Request ${currentCounter} processed, counter incremented`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

// Generate a random string on startup
const randomString = uuidv4()

// Use /shared in container, ./shared locally
const sharedPath = fs.existsSync('/shared') ? '/shared' : path.join(__dirname, 'shared')
const logFilePath = path.join(sharedPath, 'app.log')

// Ensure the shared directory exists
const sharedDir = path.dirname(logFilePath)
if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true })
}

// Write initial message
const initialMessage = `${new Date().toISOString()}: ${randomString}\n`
fs.writeFileSync(logFilePath, initialMessage)
console.log('Log generator started with random string:', randomString)
console.log('Writing to:', logFilePath)

// Write a new line every 5 seconds
setInterval(() => {
    const timeStamp = new Date().toISOString()
    const newMessage = `${timeStamp}: ${randomString}\n`
    
    // Append to the log file
    fs.appendFileSync(logFilePath, newMessage)
    console.log('Written:', newMessage.trim())
}, 5000)

//Keep the process running
process.on('SIGTERM', () => {
    console.log('Log generator shutting down...')
    process.exit(0)
})

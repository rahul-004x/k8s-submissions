const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
// Use /shared in container, ./shared locally
const sharedPath = fs.existsSync('/shared') ? '/shared' : path.join(__dirname, 'shared')
const logFilePath = path.join(sharedPath, 'app.log')

app.get('/', (req, res) => {
    try {
        // Check if the log file exists
        if (!fs.existsSync(logFilePath)) {
            return res.status(404).send('Log file not found. Waiting for log generator...')
        }
        
        // Read the log file content
        const logContent = fs.readFileSync(logFilePath, 'utf8')
        
        // Read the ping-pong counter
        const counterFilePath = path.join(sharedPath, 'counter.txt')
        let pingPongCounter = 'N/A'
        
        try {
            if (fs.existsSync(counterFilePath)) {
                const counterContent = fs.readFileSync(counterFilePath, 'utf8')
                pingPongCounter = counterContent.trim()
            }
        } catch (error) {
            console.error('Error reading ping-pong counter:', error)
        }
        
        // Combine log content with ping-pong counter
        const output = `Ping / Pongs: ${pingPongCounter}\n\n${logContent}`
        
        // Send the content as plain text
        res.set('Content-Type', 'text/plain')
        res.send(output)
    } catch (error) {
        console.error('Error reading log file:', error)
        res.status(500).send('Error reading log file')
    }
})

app.get('/health', (req, res) => {
    res.status(200).send('OK')
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Log reader server is running on port ${PORT}`)
    console.log('Reading from:', logFilePath)
})

const express = require('express')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const app = express()
// Use /shared in container, ./shared locally
const sharedPath = fs.existsSync('/shared') ? '/shared' : path.join(__dirname, 'shared')
const logFilePath = path.join(sharedPath, 'app.log')

// Ping-pong service URL (will be available as a Kubernetes service)
const PINGPONG_SERVICE_URL = process.env.PINGPONG_SERVICE_URL || 'http://pingpong-service:80/counter'

app.get('/', async (req, res) => {
    try {
        // Check if the log file exists
        if (!fs.existsSync(logFilePath)) {
            return res.status(404).send('Log file not found. Waiting for log generator...')
        }
        
        // Read the log file content
        const logContent = fs.readFileSync(logFilePath, 'utf8')
        
        // Get the ping-pong counter via HTTP request
        let pingPongCounter = 'N/A'
        
        try {
            console.log(`Making request to: ${PINGPONG_SERVICE_URL}`)
            const response = await axios.get(PINGPONG_SERVICE_URL, { timeout: 5000 })
            pingPongCounter = response.data.count
            console.log(`Received ping-pong counter: ${pingPongCounter}`)
        } catch (error) {
            console.error('Error fetching ping-pong counter via HTTP:', error.message)
            // Fallback to N/A if the service is not available
            pingPongCounter = 'N/A'
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

const { v4: uuidv4 } = require('uuid')
const express = require('express')
const app = express()

const randomString = uuidv4()
let messages = []

const initialMessage = `${new Date().toISOString()}: ${randomString}`
messages.push(initialMessage)

setInterval(() => {
    const timeStamp = new Date().toISOString()
    const newMessage = `${timeStamp}: ${randomString}`
    messages.push(newMessage)
    console.log(newMessage)
}, 5000 )

app.get('/', (req, res) => {
    res.send(messages.join('\n'))
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
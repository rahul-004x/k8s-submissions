const { v4: uuidv4 } = require('uuid')

const randomString = uuidv4()

setInterval(() => {
    const timeStamp = new Date().toISOString()
    console.log(`${timeStamp}: ${randomString}`)
}, 5000 )
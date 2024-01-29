const { createServer } = require('http')
const { join } = require('path')
const fs = require('fs')
const { Server } = require('socket.io')
let nameList = []



const server = createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile('index.html', (err,data) => {
        if(err) {
            res.end(err)
        } else {
            res.end(data)
        }
    })
})
const io = new Server(server)

io.on('connection', socket => {
    console.log(`New user connected: ${socket.id}`)
    socket.on('disconnect', ()=>{
        console.log(`A user disconnected: ${socket.id}`)
        
    })

    socket.on('message', message => {
        console.log(`Received message from ${socket.id}: ${message}`);
        socket.broadcast.emit('serverMessage', message)
    })
    socket.on('room-message', (message, room) => {
        socket.to(room).broadcast.emit('server-room-message', message)
    })
    socket.on('name-change', names => {
        nameList.push(names)
        console.log(`Client ${names[0]} changed their name to ${names[1]}`)
        console.log(nameList)
        socket.broadcast.emit('name-update', nameList, socket.id)
    })
    
})
server.listen(8000)
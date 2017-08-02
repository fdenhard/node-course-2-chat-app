const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage , generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('admin', 'welcome boyo'));

  socket.broadcast.emit('newMessage', generateMessage('admin', 'a boyo has joined'));

  socket.on('createMessage', (message, cb) => {
    console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb();
  });

  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage('admin', `${coords.latitude}, ${coords.longitude}`));
  })
  socket.on('disconnect', () => {
    console.log('Disconnected to server');
  })
})

server.listen(port, () =>{
  console.log(`Server is up on port ${port}.`)
});

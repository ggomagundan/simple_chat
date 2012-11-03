/*
var app = require('express').createServer()
var io = require('socket.io').listen(app);

app.listen(8080);
*/

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8585);


// using html page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// username that user's typing
var usernames = {};

io.sockets.on('connection', function (socket) {

  // when send chat
  socket.on('sendchat', function (data) {
    // emit the chat data
    io.sockets.emit('updatechat', socket.username, data);
  });

  // when adding user
  socket.on('adduser', function(username){
    // assign username to socket
    socket.username = username;
    // adding user array
    usernames[username] = username;
    // emit connecting message
    socket.emit('updatechat', 'SERVER', 'Hello!! -' + username + '-');
    // emit connectin message to another users
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // emit user array for change userlist
    io.sockets.emit('updateusers', usernames);
  });

  // when user disconnect.
  socket.on('disconnect', function(){
    // remove the username userlist
    delete usernames[socket.username];
    // update userlist
    io.sockets.emit('updateusers', usernames);
    // emit disconnect the user to another users
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});

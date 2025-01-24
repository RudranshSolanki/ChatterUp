import './env.js'
import express from 'express'
import {Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { connectDB } from './mongodb.config.js';
import { MessageModel } from './messageSchema.js';
import path from 'path'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods:['GET', 'POST']
    }
});
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('chatter-up.html', { root: path.join(path.resolve(), 'public') });
});
let users= [];
io.on('connection', (socket) => {

    console.log('socket connected');
    socket.on('sendmessage', async(userData) => {
        console.log(userData);
        const msg = new MessageModel(userData);
        await msg.save();
        socket.broadcast.emit('message', userData);
    });
    socket.on('userjoin',async(user)=>{
        console.log(user+" joined");
        socket.broadcast.emit('newuser', user);
        console.log('new user joined');
        users[socket.id]=user;
        io.emit('update-users',Object.values(users));
        socket.emit('loadmessages',await MessageModel.find());
    });
    socket.on('typing',(user)=>{
        socket.broadcast.emit('broadcasttyping',user);
    })
    socket.on('stoptyping',(user)=>{
        socket.broadcast.emit('broadcaststoptyping',user);
    })
    socket.on('disconnect',()=>{
        

        const username = users[socket.id];
        console.log(username+' disconnected');
        delete users[socket.id];
        socket.broadcast.emit('userleft',username);
        io.emit('update-users',Object.values(users));

    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('server running on port 3000');
    connectDB();
});
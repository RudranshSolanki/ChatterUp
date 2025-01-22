import express from 'express'
import {Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { connectDB } from './mongodb.config.js';
import { MessageModel } from './messageSchema.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods:['GET', 'POST']
    }
});

io.on('connection', (socket) => {

    console.log('socket connected');
    socket.on('sendmessage', async(userData) => {
        console.log(userData);
        const msg = new MessageModel(userData);
        await msg.save();
        socket.broadcast.emit('message', userData.message);
    });
    socket.on('userjoin',async(user)=>{
        console.log(user+" joined");
        socket.broadcast.emit('newuser', user);
        socket.emit('hello', user);   
        console.log('new user joined');
        socket.emit('loadmessages',await MessageModel.find());
    });
    socket.on('working',()=>{
        console.log('working');
    })
});

server.listen(3000, () => {
    console.log('server running on port 3000');
    connectDB();
});
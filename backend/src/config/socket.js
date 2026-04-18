let io;

const initSocket = (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        // Each user joins their own room by user ID
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};

module.exports = { initSocket, getIO };
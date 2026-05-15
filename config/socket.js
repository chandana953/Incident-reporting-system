const socketio = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketio(server, {
        cors: {
            origin: "*", // Adjust this in production
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

module.exports = {
    initSocket,
    getIO
};


let io: any;

export function socketListen(server: any)
{   
    io = require('socket.io')(server, {
        cors: {
            origin: ['http://localhost:3000']
        }
    })
    io.on('connection', function (socket: any) {
        console.log(`New connection: ${socket.id}`);

        socket.on('join_room', (room: any) => {
            socket.join(room);
            console.log(room);
        })
        socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
});
}

export function getSocket(): any 
{
    if(io == null || io == undefined)
        throw new Error("socket is not defined");
    return io;
}
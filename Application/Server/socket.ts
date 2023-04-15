// let io: any;

// export function socketListen(server: any)
// {   
//     io = require('socket.io')(server, {
//         cors: {
//             origin: ['http://localhost:3000']
//         }
//     })
//     io.on('connection', function (socket: any) {
//         console.log(`New connection: ${socket.id}`);

//         socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
// });
// }

// export function getSocket(): any 
// {
//     if(io == null || io == undefined)
//         throw new Error("socket is not defined");
//     return io;
// }
///////////////////////////////////////////
import { Server, Socket } from 'socket.io';

const WEBSOCKET_CORS = {
   origin: "*",
   methods: ["GET", "POST"]
}

class Websocket extends Server {

   private static io: Websocket;

   constructor(httpServer: any) {
       super(httpServer, {
           cors: WEBSOCKET_CORS
       });

       
   }

   public static getInstance(httpServer?: any): Websocket {

       if (!Websocket.io) {
           Websocket.io = new Websocket(httpServer);
       }

       return Websocket.io;

   }
   
   public initializeHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach(element => {
        let namespace = Websocket.io.of(element.path, (socket: Socket) => {
            element.handler.handleConnection(socket);
        });

        if (element.handler.middlewareImplementation) {
            namespace.use(element.handler.middlewareImplementation);
        }
    });
}

}

export default Websocket;
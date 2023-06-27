import SocketInterface from "./socketInterface";
import { Socket} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class MainSocket implements SocketInterface
{
    
    handleConnection(socket: Socket): void {
        socket.on('join_room', (room: any) => {
            socket.join(room);// mora postojati provera moze uz pomoc middleware
        })
        socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
    
    }
    middlewareImplementation?(socket: Socket, next: any) {
        return next();
    }
    
}

export default MainSocket;
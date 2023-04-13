import SocketInterface from "./socketInterface";
import { Socket} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class MainSocket implements SocketInterface
{
    handleConnection(socket: Socket): void {
        socket.emit('ping', 'Hi! I am a live socket connection');
    }
    middlewareImplementation?(soccket: Socket, next: any) {
        return next();
    }
    
}

export default MainSocket;
import SocketInterface from "./socketInterface";
import { Socket} from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class AppSocket implements SocketInterface
{
    handleConnection(socket: Socket): void {
        socket.emit('ping', 'Hi! I am a live socket connection');
    }
    middlewareImplementation?(soccket: Socket, next) {
        return next();
    }
    
}

export default AppSocket;
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class JoinGateway {
    @WebSocketServer() server: Server;
}
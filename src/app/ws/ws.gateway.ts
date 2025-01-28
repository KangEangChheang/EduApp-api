import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { RoomService } from "./room.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class JoinGateway {
    @WebSocketServer() server: Server;

    constructor(
        private readonly roomService: RoomService,
    ){
        Logger.log('WebsocketGateway initialized'.blue);
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('room/create')
    handleCreateRoom(@MessageBody() data: { game: string }, @ConnectedSocket() client: Socket) {
    //   console.log(`createRoom called with data: ${JSON.stringify(data)}`); // Log data
        try {
            const roomId = this.roomService.generateRoomId();
            this.roomService.createRoom(roomId, data.game);
            client.join(roomId); // Join the client to the room
            client.emit('room/roomid', { roomId });
            console.log(`Room created: ${roomId}`);
        } catch (error) {
            console.error('Error in createRoom:', error.message);
            client.emit('error', { message: 'Failed to create room' });
        }
    }

    @SubscribeMessage('room/join')
    handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
        const { roomId } = data;
        const room = this.roomService.getRoom(roomId);
        const userId = `user-${room.users.length.toString()}`
        this.roomService.addUserToRoom(roomId, userId);

        client.join(roomId); // Join the client to the room
        client.emit('room/data', { room, userId });
        this.server.to(roomId).emit('room/user', room.users);
    }
}
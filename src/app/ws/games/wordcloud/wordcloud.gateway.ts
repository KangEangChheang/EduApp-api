import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { RoomService } from '../../room.service';
import { Logger } from "@nestjs/common";

@WebSocketGateway({cors: {
    origin: '*', // Allow all origins (or specify your frontend's origin, e.g., 'http://localhost:3000')
    methods: ['GET', 'POST'],   
  }, })
export class WordCloudGateway {
    @WebSocketServer() server: Server;

    constructor() {
        Logger.log('WordCloudGateway initialized'.blue);
    }

    @SubscribeMessage('wordcloud/send-message')
    handleSendMessage(@MessageBody() data: { roomId: string, userId?: string, message: string }, @ConnectedSocket() client: Socket) {
        const { roomId, userId, message } = data;
        console.log(data.message)
        this.server.to(roomId).emit('wordcloud/recieved-message', { message });
    }
}
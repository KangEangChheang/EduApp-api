import { Module } from '@nestjs/common';
import { WordCloudGateway } from './games/wordcloud/wordcloud.gateway';
import { JoinGateway } from './ws.gateway';
import { RoomService } from './room.service';

@Module({
    imports: [

    ],
    providers: [
        WordCloudGateway,
        JoinGateway,
        RoomService,
    ],
})
export class WsModule {};
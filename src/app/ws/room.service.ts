import { Injectable } from "@nestjs/common";

interface TRoom {
  game: string;
  users: string[];
}
@Injectable()
export class RoomService {
  private rooms: Map<string, TRoom> = new Map(); // roomId => room data (hashmaps)

  createRoom(roomId: string, game: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { game, users: [] });
    } else {
      this.createRoom(this.generateRoomId(), game);
    }
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  addUserToRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);  // Add user to the room's user list
    }
  }

  getUsersInRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    console.log(room)
    return room ? room.users : [];
  }

  generateRoomId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString(); // Ensures 7 digits
  }
}
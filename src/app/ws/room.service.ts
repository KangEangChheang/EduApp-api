import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomService {
  private rooms: Map<string, any> = new Map(); // roomId => room data

  createRoom(roomId: string, game: any) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { games: game, users: [], currentGameIndex: 0 });
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
    return room ? room.users : [];
  }

}

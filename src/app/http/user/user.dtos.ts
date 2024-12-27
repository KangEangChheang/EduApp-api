import { User } from "models/user/user.model";

export class UserDtos {
    id: string;
    username: string;
    avatar: string;
    created_at: Date;
    email: string;
    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.avatar = user.avatar;
        this.created_at = user.createdAt;
        this.email = user.email;
    }
}
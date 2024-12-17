import { User } from "models/user/user.model";

export class UserDtos {
    id: string;
    username: string;
    avatar: string;
    created_at: Date;
    email: string;
    role: {
        id: string;
        role: string;
    };

    constructor(user: User) {
        this.username = user.username;
        this.avatar = user.avatar;
        this.created_at = user.createdAt;
        this.email = user.email;
        this.role = {
            id: user.user_role_id,
            role: user.user_role.role
        };
    }
}
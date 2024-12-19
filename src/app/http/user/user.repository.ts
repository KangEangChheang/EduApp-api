import { User } from 'models/user/user.model';
import { Op } from 'sequelize';

export class UserRepository {
    constructor() {}
    
    async findByEmail(email: string): Promise<User | null>{
        return User.findOne({ 
            where: {
                email: {[Op.iLike]: email}, //add Op to let all kind of character through for case sensitive email like john@gmail and John@gmail
            },
            include: [User.associations.user_role]
        });
    }

    async createOne(user: any): Promise<User> | null {
        return User.create(user, { include: [User.associations.user_role], validate: true });
    }
}

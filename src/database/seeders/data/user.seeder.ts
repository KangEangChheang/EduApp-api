
import { User } from "../../../models/user/user.model";

export const userSeeder = async () => {
    try {
        // Correctly link user_role_id
        const users = [
            {
                email: 'janedoe@gmail.com',
                username: 'jane doe',
                password: 'janedoe',
            },
            {
                email: 'student@gmail.com',
                username: 'student',
                password: 'student',
            }
        ];

        await User.bulkCreate(users, { validate: true });
        console.log("Users Seeded".green);
    } catch (e) {
        console.error(e);
    }
};

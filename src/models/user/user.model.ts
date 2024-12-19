import { Table, Column, ForeignKey, BelongsTo, BeforeCreate, BeforeBulkCreate, BeforeUpdate } from 'sequelize-typescript';
import { UserRole } from './user-role.model';
import { BaseModel } from '../base.model';
import * as bcrypt from 'bcryptjs';

@Table
export class User extends BaseModel<User> {

    @Column({ unique: true, allowNull: false })
    email!: string;

    @Column({ allowNull: true })
    username?: string;

    @Column({ allowNull: false })
    password!: string;

    @Column({ allowNull: true })
    avatar?: string;

    @Column({ defaultValue: true })
    isActive!: boolean;

    //======================
    @ForeignKey(() => UserRole)
    @Column 
    user_role_id!: string;

    //======================
    @BelongsTo(() => UserRole) user_role?: UserRole;

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10); // Hash the password before insertion or update
        }
    }

    @BeforeBulkCreate // for seeder because we use bulk create
    static bulkHashPassword(users: User[]) {
        users.map(async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }

        });
    }
}
import { Table, Column, ForeignKey, BelongsTo, BeforeCreate, BeforeBulkCreate, BeforeUpdate, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import * as bcrypt from 'bcryptjs';
import UserOTP from './user_otps.model';

@Table
export class User extends BaseModel<User> {

    @Column({ unique: true, allowNull: false })
    email!: string;

    @Column({ allowNull: true })
    username?: string;

    @Column({ allowNull: false })
    password?: string;

    @Column({ allowNull: true })
    avatar?: string;

    @Column({ allowNull: true })
    google_id?: string;

    @Column({ defaultValue: true })
    is_active!: boolean;

    @HasMany(() => UserOTP)
    otps: UserOTP[];

    //=============================
    
    @BeforeCreate
    static async hashPassword(user: User) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10); // Hash the password before insertion or update
        }
    }

    @BeforeBulkCreate // for seeder because we use bulk create
    static async bulkHashPassword(users: User[]) {
        await Promise.all(
            users.map(async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            })
        );
    }
}
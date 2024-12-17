import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserRole } from './user-role.model';

@Table
export class User extends Model<User> {
    @Column({ primaryKey: true, unique: true})
    id!: string;

    @Column
    name!: string;

    //======================
    @ForeignKey(() => UserRole)
    @Column 
    role_id!: string;

    //======================
    @BelongsTo(() => UserRole) role!: UserRole;
}
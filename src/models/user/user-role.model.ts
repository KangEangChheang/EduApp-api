import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class UserRole extends Model<UserRole> {
    @Column({ primaryKey: true, unique: true})
    id!: string;

    @Column({ allowNull: false, unique: true })
    role!: string;

    // =========================
    @HasMany(() => User) users!: User[];
}
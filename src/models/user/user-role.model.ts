import { Column, HasMany, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { BaseModel } from "../base.model";

@Table
export class UserRole extends BaseModel<UserRole> {
    @Column({ allowNull: false, unique: true })
    role!: string;

    // ===========================
    @HasMany(() => User) users!: User[];
}
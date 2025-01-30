// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

// ================================================================================================= Custom Library
import { User } from './user.model';

@Table({ tableName: 'user_otps', timestamps: true })
export class UserOTP extends Model<UserOTP> {

  // ============================================================================================= Primary Key
  @Column({ primaryKey: true, autoIncrement: true })                            id: number;

  // ============================================================================================= Foreign Key
  @ForeignKey(() => User) @Column({ allowNull: false })                         user_id: number;

  // ============================================================================================= Field Key
  @Column({ allowNull: false, type: DataType.STRING(6) })                       otp: string;
  @Column({ allowNull: false, type: DataType.DATE })                            expires_at: Date;

  // ============================================================================================= Many to One
  @BelongsTo(() => User)                                                        user: User;

}

export default UserOTP;

import { Model, Table, Column, DataType, BeforeCreate } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

@Table({
  tableName: 'user',
})
export default class User extends Model {
  isPasswordValid() {
      throw new Error('Method not implemented.');
  }
  @Column({
    type: DataType.STRING(50),
    field: 'firstName',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(50),
    field: 'middleName',
  })
  middleName!: string;

  @Column({
    type: DataType.STRING(50),
    field: 'lastName',
  })
  lastName!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'email',
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'password',
  })
  password!: string;

  @Column({
    type: DataType.STRING(20),
    field: 'mobile',
  })
  mobile!: string;

  @Column({
    type: DataType.STRING(10),
    field: 'gender',
  })
  gender!: string;

  // Hash password before saving to the database
  @BeforeCreate
  static async hashPassword(instance: User) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(instance.password, saltRounds);
    instance.password = hashedPassword;
  }

  // Method to authenticate user by comparing hashed passwords
  async authenticate(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

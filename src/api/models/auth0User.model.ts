import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate , ManyToOne} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';

@Entity()
export class Auth0User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  fullName: string = '';

  @Column({ nullable: true })
  userId: string = '';
  
  @Column({ nullable: true })
  userName: string = '';
  
  @Column({ nullable: true })
  email: string = '';

  @Column({ nullable: true })
  profilePicture: string = '';
  
  @Column({ nullable: true })
  phone: string = '';

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  biography: string = '';

  @Column({ nullable: true })
  gender: string = '';

  @Column({ nullable: false })
  sub: string = '';

  @ManyToOne(() => User, user => user.auth0Users, {onDelete: 'CASCADE'})
  user!: User;

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}

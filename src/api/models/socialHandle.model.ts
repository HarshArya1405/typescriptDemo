import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './';

@Entity()
export class SocialHandle {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
  userId: string = '';
  
  @Column({ nullable: false })
  platform: string = '';
  
  @Column({ nullable: true })
  url: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @ManyToOne(() => User, user => user.socialHandles, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'userId' })
  user!: User;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
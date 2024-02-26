import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  tagId: string = '';

  @Column({ nullable: false })
  name: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();
  
  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @ManyToOne(() => User, (user) => user.tags)
  user!: User;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}

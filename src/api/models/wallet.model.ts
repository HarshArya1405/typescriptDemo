import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
  userId: string = '';
  
  @Column({ nullable: false })
  name: string = '';
  
  @Column({ nullable: false })
  address: string = '';

  @ManyToOne(() => User, user => user.wallets, {onDelete: 'CASCADE'})
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
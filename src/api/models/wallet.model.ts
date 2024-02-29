import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
  userId: string = '';
  
  @Column({ nullable: false })
  walletName: string = '';
  
  @Column({ nullable: false })
  url: string = '';

  @Column({ nullable: false })
  balance: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
  
}
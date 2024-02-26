import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  description: string = '';
  
  @Column({ nullable: true })
  address: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now();

  @Column({ nullable: true })
  published: boolean = false;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
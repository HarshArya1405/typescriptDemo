import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class YoutubeDraft {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  userId: string = '';
  
  @Column({ nullable: false })
  url: string = '';

  @Column({ nullable: false })
  title: string = '';

  @Column({ nullable: false })
  description: string = '';

  @Column({ nullable: false })
  thumbnail: string = '';

  @Column({ nullable: false })
  publishedAt: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}

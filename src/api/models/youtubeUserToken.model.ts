import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class YoutubeUserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  userId: string = '';
  
  @Column({ nullable: false })
  access_token: string = '';

  @Column({ nullable: false })
  refresh_token: string = '';

  @Column({ nullable: false })
  scope: string = '';

  @Column({ nullable: false })
  token_type: string = '';

  @Column({ nullable: false,type: 'bigint'})
  expiry_date: number = 0;

  @Column({ nullable: false })
  token: string = '';

  @Column({ nullable: true })
  playlistId: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}

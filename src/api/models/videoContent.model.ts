import { Entity, PrimaryGeneratedColumn, Column , CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import {Tag,Protocol} from './';

@Entity()
export class VideoContent {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  userId: number = 0;
  
  @Column({ nullable: false })
  url: string = '';

  @Column({ nullable: false })
  title: string = '';

  @Column({ nullable: false })
  description: string = '';

  @Column({ nullable: false })
  thumbnail: string = '';

  @Column({ nullable: false ,default:0})
  upVote: number = 0;

  @Column({ nullable: false ,default:0})
  downVote: number = 0;

  @Column({ nullable: false })
  personalNote: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol)
  @JoinTable()
  protocols!: Protocol[];
}
import { Entity, PrimaryGeneratedColumn, Column , CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import {Tag,Protocol} from './';
import { v4 as uuidv4 } from 'uuid';


@Entity()
export class VideoContent {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
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
  personalNote: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol, { cascade: true })
  @JoinTable()
  protocols!: Protocol[];
}
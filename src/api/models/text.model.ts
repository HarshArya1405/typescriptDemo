import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { Protocol } from './protocol.model';
import { Tag } from './tag.model';

@Entity()
export class Text {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
  userId: string = '';
  
  @Column({ nullable: false })
  content: string = '';

  @Column({ nullable: false })
  text: string = '';

  @Column({ nullable: false })
  caption: string = '';

  @Column({ nullable: false })
  description: string = '';

  @Column({ nullable: false })
  meta_information: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }

  @ManyToOne(() => User, user => user.texts)
  user!: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol)
  @JoinTable()
  protocols!: Protocol[];
  
}

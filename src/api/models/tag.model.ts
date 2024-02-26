import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  tagId: string = '';
  
  @Column({ nullable: false })
  name: string = '';
  static save: (tag: Tag) => Promise<Tag>;

  @ManyToOne(() => User, user => user.tags)
  user!: User;
}
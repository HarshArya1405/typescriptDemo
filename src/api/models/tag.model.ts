import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  tagId: string = '';
  
  @Column({ nullable: false })
  name: string = '';
  static save: (tag: Tag) => Promise<Tag>;
}
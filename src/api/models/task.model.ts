import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  title: string = '';

  @Column({ nullable: false })
  description: string = '';

  @Column({ nullable: false })
  published: boolean = false;
}
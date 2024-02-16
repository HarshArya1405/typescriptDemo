import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  fullName: string = '';
  
  @Column({ nullable: false })
  userName: string = '';
  
  @Column({ nullable: false })
  email: string = '';

  @Column({ nullable: false })
  profilePicture: string = '';
  
  @Column({ nullable: false })
  phone: string = '';

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  biography: string = '';

  @Column({ nullable: false })
  role: string = '';

  @Column({ nullable: false })
  gender: string = '';

  @Column({ nullable: false })
  password: string = '';
}
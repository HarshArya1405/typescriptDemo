import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { Tag,Protocol,OnBoardingFunnel } from './';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: true })
  fullName: string = '';
  
  @Column({ nullable: true })
  userName: string = '';
  
  @Column({ nullable: true })
  email: string = '';

  @Column({ nullable: true })
  profilePicture: string = '';
  
  @Column({ nullable: true })
  phone: string = '';

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  biography: string = '';

  @Column({ nullable: false })
  role: string = '';

  @Column({ nullable: true })
  gender: string = '';

  @Column({ nullable: false })
  authOkey: string = '';

  @OneToMany(() => OnBoardingFunnel, onBoardingFunnel => onBoardingFunnel.user)
  onBoardingFunnels!: OnBoardingFunnel[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol)
  @JoinTable()
  protocols!: Protocol[];

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
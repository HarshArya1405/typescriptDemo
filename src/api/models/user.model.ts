import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { Tag,Protocol,OnBoardingFunnel,Text, SocialHandle, Wallet } from './';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

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

  @OneToMany(() => Text, text => text.user)
  texts!: Text[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol)
  @JoinTable()
  protocols!: Protocol[];

  @OneToMany(() => SocialHandle, socialHandle => socialHandle.user)
  socialHandles!: SocialHandle[];

  @OneToMany(() => Wallet, wallet => wallet.user)
  wallets!: Wallet[];

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
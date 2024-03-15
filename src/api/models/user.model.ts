import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { Tag,Protocol, SocialHandle, Wallet, auth0User } from './';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  auth0UserId?: string;

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
  sub: string = '';

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

  @OneToMany(() => auth0User, auth0User => auth0User.user)
  auth0Users!: auth0User[];

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
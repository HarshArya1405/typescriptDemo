import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { Tag,Protocol, SocialHandle, Wallet, Auth0User, Role } from './';
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
  profilePicturePath: string = '';
  
  @Column({ nullable: true })
  phone: string = '';

  @Column({ nullable: true })
  title: string = '';

  @Column({ nullable: true })
  biography: string = '';

  @Column({ nullable: true })
  gender: string = '';

  @Column({nullable:true})
  syncYoutube: boolean = false;

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags!: Tag[];

  @ManyToMany(() => Protocol)
  @JoinTable()
  protocols!: Protocol[];

  @OneToMany(() => Auth0User, auth0User => auth0User.user,{ cascade: true})
  auth0Users!: Auth0User[];

  @OneToMany(() => SocialHandle, socialHandle => socialHandle.user ,{ cascade: true})
  socialHandles!: SocialHandle[];

  @OneToMany(() => Wallet, wallet => wallet.user,{ cascade: true})
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
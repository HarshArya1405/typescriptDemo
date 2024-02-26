import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { Tag } from './tag.model';
import { Protocol } from './protocol.model';

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
  authOkey: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now();  

  @OneToMany(() => Tag, tag => tag.user)
  tags!: Tag[];

  @OneToMany(() => Protocol, protocol => protocol.user)
  protocols!: Protocol[];

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}
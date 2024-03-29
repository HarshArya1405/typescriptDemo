import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
@Entity()
export class Protocol {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  external_id_lama: string = '';

  @Column({ nullable: false })
  slug: string = '';

  @Column({ nullable: false })
  name: string = '';

  @Column({ nullable: false })
  description: string = '';

  @Column({ nullable: true, type: 'varchar' })
  logo: string | null = null;

  @Column({ nullable: false })
  category: string = '';

  @Column({ nullable: false })
  url: string = '';

  @Column({ nullable: false })
  symbol: string = '';

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}

// Import necessary modules and types
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { User } from './user.model';

// Define enum for onboarding status
enum OnBoardingStatus {
  Skipped = 'skipped',
  Completed = 'completed'
}

// Entity for OnBoardingFunnel
@Entity()
export class OnBoardingFunnel {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false })
  userId: number = 0;
  
  @Column({ nullable: false })
  stage: string = '';

  @Column({
    type: 'enum',
    enum: OnBoardingStatus,
    default: OnBoardingStatus.Skipped // Set a default value if needed
  })
  status: string = OnBoardingStatus.Skipped;

  @CreateDateColumn({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number = Date.now();

  @UpdateDateColumn({ type: 'bigint', nullable: false, default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number = Date.now(); 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = Date.now();
  }

  @ManyToOne(() => User, user => user.tags)
  user!: User;
}

// Import necessary modules and types
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// Define enum for onboarding status
enum OnBoardingStatus {
  Skipped = 'skipped',
  Completed = 'completed'
}

// Entity for OnBoardingFunnel
@Entity()
export class OnBoardingFunnel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: false })
  userId: string = '';
  
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
}

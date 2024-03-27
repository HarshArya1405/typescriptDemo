import { Service } from 'typedi';
import { AppDataSource } from '../../../loaders/typeormLoader';
import logger from '../../../util/logger';
import { CreatorFollower } from '../../models/creatorFollower.model';
import { User } from '../../models';
import { FindManyOptions, In, Like } from 'typeorm';

const creatorFollowerRepository = AppDataSource.getRepository(CreatorFollower);
const userRepository = AppDataSource.getRepository(User);

@Service()
export class CreatorFollowerService {
  constructor() { }

  // Method to toggle follow/unfollow
  public async toggleFollow(learnerId: string, creatorId: string, action: string): Promise<void> {
    try {
      if (action === 'follow') {
        await creatorFollowerRepository.save({ creatorId, learnerId });
        logger.info(`User with ID ${learnerId} followed creator with ID ${creatorId}`);
      } else if (action === 'unfollow') {
        const existingFollow = await creatorFollowerRepository.findOne({ where: { creatorId, learnerId } });
        if (existingFollow) {
          await creatorFollowerRepository.delete(existingFollow.id);
          logger.info(`User with ID ${learnerId} unfollowed creator with ID ${creatorId}`);
        } else {
          logger.info(`User with ID ${learnerId} is not following creator with ID ${creatorId}`);
        }
      } else {
        logger.error('Invalid action provided');
        throw new Error('Invalid action');
      }
    } catch (error) {
      logger.error(`Error toggling follow/unfollow: ${error}`);
      throw error;
    }
  }
  
// Method to list creators followed by a learner with pagination and name filter
public async listCreatorsForLearner(learnerId: string, searchParams: { fullName?: string, limit?: number, offset?: number }): Promise<object> {
    try {
      const creatorsFollowed = await creatorFollowerRepository.find({ where: { learnerId } });
      
      // Extract unique creator IDs
      const creatorIds = Array.from(new Set(creatorsFollowed.map(follow => follow.creatorId)));
      
      const options: FindManyOptions<User> = {
        skip: searchParams.offset,
        take: searchParams.limit,
        where: {},
      };
  
      if (searchParams.fullName) {
        options.where = { ...options.where, userName: Like(`%${searchParams.fullName}%`) };
      }
  
      // Fetch creators from the User repository with pagination and name filter
      const [creators, count] = await userRepository.findAndCount({ ...options, where: { ...options.where, id: In(creatorIds) } });
  
      return { count, creators };
    } catch (error) {
      throw new Error(`Error listing creators for learner: ${error}`);
    }
  }
  // Method to list learners of a particular creator with pagination and name filter
  public async listLearnersForCreator(creatorId: string, searchParams: { fullName?: string, limit?: number, offset?: number }): Promise<object> {
    try {
        const learnersFollowed = await creatorFollowerRepository.find({ where: { creatorId } });
        
        // Extract unique learner IDs
        const learnerIds = Array.from(new Set(learnersFollowed.map(follow => follow.learnerId)));

        const options: FindManyOptions<User> = {
            skip: searchParams.offset,
            take: searchParams.limit,
            where: {},
        };

        if (searchParams.fullName) {
            options.where = { ...options.where, fullName: Like(`%${searchParams.fullName}%`) };
        }

        // Fetch learners from the User repository with pagination and name filter
        const [learners, count] = await userRepository.findAndCount({ ...options, where: { ...options.where, id: In(learnerIds) } });

        return { count, learners };
    } catch (error) {
        throw new Error(`Error listing learners for creator: ${error}`);
    }
}
}

import { JsonController, Post, Body, BadRequestError, Param, Get } from 'routing-controllers';
import { CreatorFollower } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { CreatorFollowerService } from '../services/creator.follower.service';
import { BadRequestParameterError } from '../../errors';

const creatorFollowerService = new CreatorFollowerService();

@JsonController('/api/v1/follower')
export class CreatorFollowerController {
  private creatorFollowerRepository = AppDataSource.getRepository(CreatorFollower);

  @Post('/followUnfollow')
  public async toggleFollow(@Body() requestBody: { learnerId: string, creatorId: string, action: string }): Promise<{ success: boolean }> {
    try {
      const { learnerId, creatorId, action } = requestBody;
  
      if (action !== 'follow' && action !== 'unfollow') {
        throw new BadRequestError('Invalid action provided');
      }
  
      if (action === 'follow') {
        const existingFollow = await this.creatorFollowerRepository.findOne({ where: { creatorId, learnerId } });
        if (existingFollow) {
          throw new BadRequestParameterError(`User with ID ${learnerId} is already following creator with ID ${creatorId}`);
        }
        const newFollow = this.creatorFollowerRepository.create({ creatorId, learnerId });
        await this.creatorFollowerRepository.save(newFollow);
      } else {
        const existingFollow = await this.creatorFollowerRepository.findOne({ where: { creatorId, learnerId } });
        if (existingFollow) {
          await this.creatorFollowerRepository.delete(existingFollow.id);
        }
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw new BadRequestError('Failed to toggle follow status.');
    }
  }

  @Get('/:learnerId')
  public async listCreatorsForLearner(@Param('learnerId') learnerId: string): Promise<object> {
    try {
      const creators = await creatorFollowerService.listCreatorsForLearner(learnerId, {});
      return creators;
    } catch (error) {
      console.error('Error listing creators for learner:', error);
      throw new BadRequestError('Failed to list creators for learner.');
    }
  }

  @Get('/:creatorId/learner')
  public async listLearnersForCreator(@Param('creatorId') creatorId: string): Promise<object> {
      try {
          const learners = await creatorFollowerService.listLearnersForCreator(creatorId, {});
          return learners;
      } catch (error) {
          console.error('Error listing learners for creator:', error);
          throw new BadRequestError('Failed to list learners for creator.');
      }
  }
}

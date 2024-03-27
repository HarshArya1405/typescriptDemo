import { JsonController, Post, Body, BadRequestError, Param, Get } from 'routing-controllers';
import { CreatorFollower } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { CreatorFollowerService } from '../services/creator.follower.service';

const creatorFollowerService = new CreatorFollowerService();

@JsonController('/creator-followers')
export class CreatorFollowerController {
  private creatorFollowerRepository = AppDataSource.getRepository(CreatorFollower);

  @Post('/toggle-follow')
  public async toggleFollow(@Body() requestBody: { learnerId: string, creatorId: string }): Promise<string> {
    try {
      const { learnerId, creatorId } = requestBody;

      const existingFollow = await this.creatorFollowerRepository.findOne({ where: { creatorId, learnerId } });

      if (existingFollow) {
        await this.creatorFollowerRepository.delete(existingFollow.id);
        return `User with ID ${learnerId} unfollowed creator with ID ${creatorId} successfoolly.`;
      } else {
        const newFollow = this.creatorFollowerRepository.create({ creatorId, learnerId });
        await this.creatorFollowerRepository.save(newFollow);
        return `User with ID ${learnerId} followed creator with ID ${creatorId} successfoolly.`;
      }
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

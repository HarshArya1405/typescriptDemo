// Import necessary modules and types
import { Vote } from '../../models/vote.model';
import { JsonController, Post, Get, Param, Body } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { VoteService } from '../services/vote.service';

// Controller for Vote endpoints
@JsonController('/api/v1/content/:contentId/vote')
export class VoteController {

    private voteService: VoteService;

    constructor() {
        this.voteService = new VoteService();
    }
  
    /**
     * Endpoint to create a vote for a specific content
     * @param contentId ID of the content
     * @param body Vote data including userID and voteType
     * @returns Created vote
     */
    @Post('')
    @ResponseSchema(Vote)
    public async create(
        @Param('contentId') contentId: string,
        @Body() body: { userId: string, voteType: 'UpVote' | 'DownVote' }
    ): Promise<Vote> {
        try {
            const { userId, voteType } = body;
            return await this.voteService.create(contentId, userId, voteType);
        } catch (error) {
            console.error('Error creating vote:', error);
            throw error;
        }
    }
    
    /**
     * Endpoint to retrieve all votes for a specific content
     * @param contentId ID of the content
     * @returns List of votes for the content
     */
    @Get('')
    public async list(
        @Param('contentId') contentId: string
    ): Promise<Vote[] | null> {
        try {
            const votes = await this.voteService.list(contentId);
            if (votes === null) {
                // Handle the case where no votes are found
                return [];
            }
            return votes;
        } catch (error) {
            console.error('Error retrieving votes:', error);
            throw error;
        }
    }
}

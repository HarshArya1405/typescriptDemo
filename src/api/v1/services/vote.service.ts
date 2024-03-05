// Import necessary modules and types
import { Vote } from '../../models/vote.model';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { FindOneOptions } from 'typeorm';

// Get repository for vote
const voteRepository = AppDataSource.getRepository(Vote);

// Service class for Vote
export class VoteService {

    constructor() { }

    /**
     * Create a vote for a specific content and user
     * @param contentId The ID of the content for which the vote is being created
     * @param userId The ID of the user who is creating the vote
     * @param voteType The type of vote (UpVote or DownVote)
     * @returns The created vote
     */
    public async create(contentId: string, userId: string, voteType: 'UpVote' | 'DownVote'): Promise<Vote> {
        try {
            const existingVote = await voteRepository.findOne({ where: { userId, contentId } } as FindOneOptions<Vote>);
            if (existingVote) {
                existingVote.voteType = voteType;
                return await voteRepository.save(existingVote);
            } else {
                const newVote = voteRepository.create({ userId, voteType, contentId } as Partial<Vote>);
                return await voteRepository.save(newVote);
            }
        } catch (error) {
            console.error('Error creating vote:', error);
            throw error;
        }
    }
    /**
     * Retrieve all votes for a specific content
     * @param contentId The ID of the content for which votes are being retrieved
     * @returns Array of votes
     */
    public async list(contentId: string): Promise<Vote[]> {
        try {
            return await voteRepository.find({ where: { contentId } });
        } catch (error) {
            console.error('Error listing votes:', error);
            throw error;
        }
    }
}

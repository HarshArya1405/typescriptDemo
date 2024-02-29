// Import necessary modules and types
import { VideoContent } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { FindManyOptions, Like } from 'typeorm';
import { DuplicateRecordFoundError, NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';

// Get repository for video content
const videoContentRepository = AppDataSource.getRepository(VideoContent);

// Service class for Video Content
export class VideoContentService {

    constructor() { }

    /**
     * Imports video content data for a given creator ID
     * @param creatorId The ID of the creator
     * @param data Array of video content data to import
     * @returns Success message if data is imported successfully
     */
    public async import(creatorId: number, data: []): Promise<object> {
        try {
            if (data && data.length > 0) {
                for (const row of data) {
                    await this.create(creatorId, row);
                }
            }
            return { success: true };
        } catch (error) {
            console.error('Error importing video content:', error);
            throw error;
        }
    }

    /**
     * Creates new video content for a given creator ID
     * @param creatorId The ID of the creator
     * @param data Video content data to create
     * @returns The created video content
     */
    public async create(creatorId: number, data: VideoContent): Promise<VideoContent> {
        try {
            const existingVideoContent = await videoContentRepository.findOne({
                where: { userId: creatorId, title: data.title }
            });

            if (existingVideoContent) {
                throw new DuplicateRecordFoundError(MESSAGES.VIDEO_TITLE_EXIST);
            }

            const videoContent = await videoContentRepository.save(data);

            return videoContent;
        } catch (error) {
            console.error('Error creating video content:', error);
            throw error;
        }
    }

    /**
     * Retrieves video content by ID for a given creator ID
     * @param creatorId The ID of the creator
     * @param videoContentId The ID of the video content
     * @returns The retrieved video content
     */
    public async get(creatorId: number, videoContentId: number): Promise<VideoContent> {
        try {
            const videoContent = await videoContentRepository.findOne({
                where: { userId: creatorId, id: videoContentId },
                relations: ['tags', 'protocols']
            });
            if (!videoContent) {
                throw new NoRecordFoundError(MESSAGES.VIDEO_NOT_EXIST);
            }
            return videoContent;
        } catch (error) {
            console.error('Error getting video content:', error);
            throw error;
        }
    }

    /**
     * Lists video content for a given creator ID with optional search parameters
     * @param creatorId The ID of the creator
     * @param query Object containing limit, offset, and optional title for search
     * @returns Object containing the count and list of video content
     */
    public async list(creatorId: number, query: { limit?: number, offset?: number, title?: string }): Promise<object> {
        try {
            const options: FindManyOptions<VideoContent> = {
                skip: query.offset,
                take: query.limit,
                where: {},
            };

            if (query.title) {
                options.where = { title: Like(`%${query.title}%`) };
            }
            options.relations = ['tags', 'protocols'];
            const [videoContents, count] = await videoContentRepository.findAndCount(options);
            return { count, videoContents };
        } catch (error) {
            console.error('Error listing video content:', error);
            throw error;
        }
    }

    /**
     * Updates video content by ID for a given creator ID
     * @param creatorId The ID of the creator
     * @param videoContentId The ID of the video content to update
     * @param data Partial data containing fields to update
     * @returns The updated video content
     */
    public async update(creatorId: number, videoContentId: number, data: Partial<VideoContent>): Promise<VideoContent> {
        try {
            const videoContent = await videoContentRepository.findOne({ where: { userId: creatorId, id: videoContentId } });
            if (!videoContent) {
                throw new NoRecordFoundError(MESSAGES.VIDEO_NOT_EXIST);
            }
            const videoTitleQuery = videoContentRepository.createQueryBuilder('videoContent')
                .where('videoContent.title = :title', { title: data.title })
                .andWhere('videoContent.id != :videoContentId', { videoContentId })
                .andWhere('videoContent.userId = :userId', { userId: creatorId });

            const videoTitleExist = await videoTitleQuery.getOne();
            if (videoTitleExist) {
                throw new DuplicateRecordFoundError(MESSAGES.VIDEO_TITLE_EXIST);
            }
            Object.assign(videoContent, data);
            await videoContentRepository.save(videoContent);
            return videoContent;
        } catch (error) {
            console.error('Error updating video content:', error);
            throw error;
        }
    }

    /**
     * Deletes video content by ID for a given creator ID
     * @param creatorId The ID of the creator
     * @param videoContentId The ID of the video content to delete
     * @returns Success message if video content is deleted successfully
     */
    public async delete(creatorId: number, videoContentId: number): Promise<{ success: boolean } | { error: string }> {
        try {
            const videoContent = await videoContentRepository.findOne({ where: { userId: creatorId, id: videoContentId } });
            if (!videoContent) {
                throw new NoRecordFoundError(MESSAGES.VIDEO_NOT_EXIST);
            }
            await videoContentRepository.delete(videoContentId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting video content:', error);
            throw error;
        }
    }
}

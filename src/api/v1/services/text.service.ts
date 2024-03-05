// Import necessary modules and types
import { Text } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { FindManyOptions, Like } from 'typeorm';
import { NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';

// Get repository for text
const textRepository = AppDataSource.getRepository(Text);

// Service class for Text
export class TextService {

    constructor() { }

    /**
     * Creates new text content for a given user ID
     * @param userId The ID of the user
     * @param data Text data to create
     * @returns The created text
     */
    public async create(userId: string, data: Text): Promise<Text> {
        try {
            const text = textRepository.create({ ...data, userId });
            return await textRepository.save(text);
        } catch (error) {
            console.error('Error creating text content:', error);
            throw error;
        }
    }

    /**
     * Retrieves text content by ID
     * @param textId The ID of the text content
     * @returns The retrieved text content
     */
    public async get(textId: string): Promise<Text> {
        try {
            const text = await textRepository.findOne({ where: { id: textId }, relations: ['tags', 'protocols'] });
            if (!text) {
                throw new NoRecordFoundError(MESSAGES.TEXT_NOT_EXIST);
            }
            return text;
        } catch (error) {
            console.error('Error getting text content:', error);
            throw error;
        }
    }

    /**
     * Lists text content with optional search parameters
     * @param creatorId The ID of the creator
     * @param query Object containing limit, offset, and optional content for search
     * @returns Object containing the count and list of text content
     */
    public async list(creatorId: string, query: { limit?: number, offset?: number, content?: string }): Promise<object> {
        try {
            const options: FindManyOptions<Text> = {
                skip: query.offset,
                take: query.limit,
                where: {},
                relations: ['tags', 'protocols']
            };

            if (query.content) {
                options.where = { content: Like(`%${query.content}%`) };
            }

            const [texts, count] = await textRepository.findAndCount(options);
            return { count, texts };
        } catch (error) {
            console.error('Error listing text content:', error);
            throw error;
        }
    }

    /**
     * Updates text content by ID
     * @param textId The ID of the text content to update
     * @param data Partial data containing fields to update
     * @returns The updated text content
     */
    public async update(textId: string, data: Partial<Text>): Promise<Text> {
        try {
            const text = await textRepository.findOne({ where: { id: textId }, relations: ['tags', 'protocols'] });
            if (!text) {
                throw new NoRecordFoundError(MESSAGES.TEXT_NOT_EXIST);
            }

            Object.assign(text, data);
            return await textRepository.save(text);
        } catch (error) {
            console.error('Error updating text content:', error);
            throw error;
        }
    }

    /**
     * Deletes text content by ID
     * @param textId The ID of the text content to delete
     * @returns Success message if text content is deleted successfully
     */
    public async delete(textId: string): Promise<{ success: boolean } | { error: string }> {
        try {
            const text = await textRepository.findOne({ where: { id: textId } });
            if (!text) {
                throw new NoRecordFoundError(MESSAGES.TEXT_NOT_EXIST);
            }
            await textRepository.delete(textId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting text content:', error);
            throw error;
        }
    }
}

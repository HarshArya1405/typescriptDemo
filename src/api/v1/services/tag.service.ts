import axios from 'axios';
import { Tag } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { Like } from 'typeorm';
import logger from '../../../util/logger';

// Get repository
const tagRepository = AppDataSource.getRepository(Tag);

// Service class for Tag
export class TagService {
  
  constructor() {}

  // Method to fetch and dump tag data from an external API
  public async fetchAndDumpData(): Promise<object> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/categories');
      const tagsData = response.data;

      for (const tagData of tagsData) {
        const tagExist = await tagRepository.findOneBy({ tagId: tagData.id });
        if (!tagExist) {
          const tag = new Tag();
          tag.tagId = tagData.id;
          tag.name = tagData.name;
          await tagRepository.save(tag);
        }
      }

      return { success: true };
    } catch (error) {
      logger.error(`[TagService][fetchAndDumpData] - Error : ${error}`);
      throw error;
    }
  }

  // Method to create a new tag
  public async create(name: string): Promise<Tag> {
    try {
		  logger.info(`[TagService][create]  - ${JSON.stringify(name)}`);
      const tagId = name.toLowerCase().replace(/\s/g, '-');
      const existingTag = await tagRepository.findOne({ where: { tagId } });

      if (existingTag) {
        throw new Error('Tag with the same name already exists');
      }

      const tag = new Tag();
      tag.tagId = tagId;
      tag.name = name;
      await tagRepository.save(tag);

      return tag;
    } catch (error) {
      logger.error(`[TagService][create] - Error : ${error}`);
      throw error;
    }
  }

  // Method to list tags with optional name filter
  public async list(offset: number, limit: number, nameFilter: string): Promise<object> {
    try {
      const options = {
        skip: offset,
        take: limit,
        where: {},
      };

      if (nameFilter) {
        options.where = { name: Like(`%${nameFilter}%`) };
      }

      const [tags, count] = await tagRepository.findAndCount(options);
      return { count, tags };
    } catch (error) {
      logger.error(`[TagService][list] - Error : ${error}`);
      throw error;
    }
  }

  // Method to update an existing tag
  public async update(tagId: string, newData: Partial<Tag>): Promise<{ success: boolean } | { error: string }> {
    try {
		  logger.info(`[TagService][update]  - ${JSON.stringify(newData)}`);
      const tag = await tagRepository.findOne({ where: { id: tagId } });
      if (tag) {
        Object.assign(tag, newData);
        await tagRepository.save(tag);
        return { success: true };
      } else {
        return { error: '404' };
      }
    } catch (error) {
      logger.error(`[TagService][update] - Error : ${error}`);
      throw error;
    }
  }

  // Method to delete a tag by ID
  public async delete(tagId: string): Promise<{ success: boolean } | { error: string }> {
    try {
		  logger.info(`[TagService][delete]  - ${JSON.stringify(tagId)}`);
      const tag = await tagRepository.findOne({ where: { id: tagId } });
      if (tag) {
        await tagRepository.remove(tag);
        return { success: true };
      } else {
        return { error: '404' };
      }
    } catch (error) {
      logger.error(`[TagService][delete] - Error : ${error}`);
      throw error;
    }
  }
}

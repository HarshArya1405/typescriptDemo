import axios from 'axios';
import { Tag } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { Like } from 'typeorm';

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
      const tags: Tag[] = [];

      await tagRepository.manager.transaction(async transactionalEntityManager => {
        for (const tagData of tagsData) {
          const tag = new Tag();
          tag.tagId = tagData.id;
          tag.name = tagData.name;
          await transactionalEntityManager.save(tag);
          tags.push(tag);
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error fetching and dumping data:', error);
      throw error;
    }
  }

  // Method to create a new tag
  public async create(name: string): Promise<Tag> {
    try {
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
      console.error('Error creating tag:', error);
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
      console.error('Error listing tags:', error);
      throw error;
    }
  }

  // Method to update an existing tag
  public async update(tagId: string, newData: Partial<Tag>): Promise<{ success: boolean } | { error: string }> {
    try {
      const result = await tagRepository.manager.transaction(async transactionalEntityManager => {
        const tag = await transactionalEntityManager.findOne(Tag, { where: { id: tagId } });
        if (!tag) {
          return { error: '404' };
        }
        Object.assign(tag, newData);
        await transactionalEntityManager.save(tag);
        return { success: true };
      });
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      return { error: '500' };
    }
  }

  // Method to delete a tag by ID
  public async delete(tagId: string): Promise<{ success: boolean } | { error: string }> {
    try {
      const result = await tagRepository.manager.transaction(async transactionalEntityManager => {
        const tag = await transactionalEntityManager.findOne(Tag, { where: { id: tagId } });
        if (!tag) {
          return { error: '404' };
        }
        await transactionalEntityManager.remove(tag);
        return { success: true };
      });
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return { error: '500' };
    }
  }
}

import axios from 'axios';
import { Tag } from '../models/tag.model';
import { AppDataSource } from '../../loaders/typeormLoader';
import { Like } from 'typeorm';

const tagRepository = AppDataSource.getRepository(Tag);

export class TagService {

  constructor() {}

  public async fetchAndDumpData(): Promise<Tag[]> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/categories');
      const tagsData = response.data;

      const tags: Tag[] = [];

      for (const tagData of tagsData) {
        const tag = new Tag();
        tag.tagId = tagData.id;
        tag.name = tagData.name;
        
        // Save each tag individually
        await tagRepository.save(tag);

        tags.push(tag);
      }

      return tags;
    } catch (error) {
      console.error('Error fetching and dumping data:', error);
      throw error;
    }
  }

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

      const [tags, count ] = await tagRepository.findAndCount(options);
      return  { count, tags};
    } catch (error) {
      console.error('Error listing tags:', error);
      throw error;
    }
  }

  public async update(tagId: number, newData: Partial<Tag>): Promise<{ success: boolean } | { error: string }> {
    try {
      const tag = await tagRepository.findOne({ where: { id: tagId } });
      if (tag) {
        Object.assign(tag, newData);
        await tagRepository.save(tag);
        return { success: true };
      } else {
        return { error: '404' };
      }
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  public async delete(tagId: number): Promise<{ success: boolean } | { error: string }> {
    try {
      const tag = await tagRepository.findOne({ where: { id: tagId } });
      if (tag) {
        await tagRepository.remove(tag);
        return { success: true };
      } else {
        return { error: '404' };
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
}

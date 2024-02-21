import axios from 'axios';
import { Tag } from '../models/tag.model';
import { AppDataSource } from '../../loaders/typeormLoader';

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
}

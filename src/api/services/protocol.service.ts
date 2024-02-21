import axios from 'axios';
import { Protocol } from '../models/protocol.model';
import { FindManyOptions, Like } from 'typeorm';
import { AppDataSource } from '../../loaders/typeormLoader';

const protocolRepository = AppDataSource.getRepository(Protocol);

export class ProtocolService {

  constructor() {}

  public async fetchAndDumpData(): Promise<Protocol[]> {
    try {
      const response = await axios.get('https://api.llama.fi/protocols');
      const protocolsData = response.data;

      const protocols: Protocol[] = [];

      for (const protocolData of protocolsData) {
        const protocol = new Protocol();
        protocol.external_id_lama = protocolData.id || '';
        protocol.slug = protocolData.slug;
        protocol.name = protocolData.name;
        protocol.description = protocolData.description || '';
        protocol.logo = protocolData.logo;
        protocol.category = protocolData.category;
        protocol.url = protocolData.url;
        protocol.symbol = protocolData.symbol;
        
        // Save each protocol individually
        await protocolRepository.save(protocol);

        protocols.push(protocol);
      }

      return protocols;
    } catch (error) {
      console.error('Error fetching and dumping data:', error);
      throw error;
    }
  }

  public async list(offset: number, limit: number, nameFilter: string, categoryFilter: string): Promise<object> {
    try {
      const options: FindManyOptions<Protocol> = {
        skip: offset,
        take: limit,
        where: {},
      };

      // Apply name and category filters simultaneously
      if (nameFilter && categoryFilter) {
        options.where = {
          name: Like(`%${nameFilter}%`),
          category: Like(`%${categoryFilter}%`)
        };
      } else if (nameFilter) {
        options.where = { name: Like(`%${nameFilter}%`) };
      } else if (categoryFilter) {
        options.where = { category: Like(`%${categoryFilter}%`) };
      }

      const [protocols, count ] = await protocolRepository.findAndCount(options);
      return  { count, protocols };
    } catch (error) {
      console.error('Error listing protocols:', error);
      throw error;
    }
  }
}

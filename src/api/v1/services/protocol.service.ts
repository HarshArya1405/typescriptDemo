// Import dependencies
import axios from 'axios';
import { Protocol } from '../../models';
import { FindManyOptions, Like } from 'typeorm';
import { AppDataSource } from '../../../loaders/typeormLoader';
import logger from '../../../util/logger';

// Get repository
const protocolRepository = AppDataSource.getRepository(Protocol);

// Service class for Protocol
export class ProtocolService {

  constructor() {}

  // Method to fetch and dump data from external API
  public async fetchAndDumpData(): Promise<object> {
    try {
      // Fetch data from external API
      const response = await axios.get('https://api.llama.fi/protocols');
      const protocolsData = response.data;

      // Process fetched data
      for (const protocolData of protocolsData) {
        const protocolExist = await protocolRepository.findOneBy({ external_id_lama: protocolData.id });
        if (!protocolExist) {
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
        }
      }

      return { success: true };
    } catch (error) {
      logger.error(`[ProtocolService][fetchAndDumpData] - Error : ${error}`);
      throw error;
    }
  }

  // Method to list protocols with optional filters
  public async list(query: { offset: number, limit: number, nameFilter: string, categoryFilter: string }): Promise<object> {
    try {
      logger.info(`[ProtocolService][list]  - ${JSON.stringify(query)}`);
      const options: FindManyOptions<Protocol> = {
        skip: query.offset,
        take: query.limit,
        where: {},
      };

      // Apply name and category filters simultaneously
      if (query.nameFilter && query.categoryFilter) {
        options.where = {
          name: Like(`%${query.nameFilter}%`),
          category: Like(`%${query.categoryFilter}%`)
        };
      } else if (query.nameFilter) {
        options.where = { name: Like(`%${query.nameFilter}%`) };
      } else if (query.categoryFilter) {
        options.where = { category: Like(`%${query.categoryFilter}%`) };
      }

      // Find protocols with count
      const [protocols, count] = await protocolRepository.findAndCount(options);
      logger.info(`[ProtocolService][listData]  - ${JSON.stringify(protocols)}`);
      return { count, protocols };
    } catch (error) {
      logger.error(`[ProtocolService][list] - Error : ${error}`);
      throw error;
    }
  }

}

import axios from 'axios';
import { Protocol } from '../models/protocol.model';
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
        protocol.external_id_lama = protocolData.external_id || '';
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
}

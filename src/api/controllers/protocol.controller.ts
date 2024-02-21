import { Protocol } from '../models/protocol.model';
import { JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { ProtocolService } from '../services/protocol.service';

@JsonController('/protocol')
export class ProtocolController {

  private protocolService: ProtocolService;

  constructor() {
    this.protocolService = new ProtocolService();
  }

  @Post()
  @ResponseSchema(Protocol, { isArray: true })
  public async fetchAndDumpData(): Promise<Protocol[]> {
    return await this.protocolService.fetchAndDumpData();
  }
}

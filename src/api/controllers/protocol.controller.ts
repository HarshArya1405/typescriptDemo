import { Protocol } from '../models/protocol.model';
import { JsonController, Post, Get, QueryParams } from 'routing-controllers';
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
  @Get()
  public async list(
    @QueryParams() query: { offset?: number; limit?: number; name?: string; category?: string }
  ): Promise<object> {
    const { offset = 0, limit = 10, name = '', category = '' } = query;
    return await this.protocolService.list(offset, limit, name, category);
  }
}

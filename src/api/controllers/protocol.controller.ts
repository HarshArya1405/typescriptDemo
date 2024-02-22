import { Protocol } from '../models/protocol.model';
import { JsonController, Post, Get, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { ProtocolService } from '../services/protocol.service';
import { IsNotEmpty, IsOptional } from 'class-validator';

class GetProtocolsQuery {
  @IsOptional()
  name!: string;

  @IsOptional()
  category!: string;

  @IsNotEmpty()
  offset!: number;

  @IsNotEmpty()
  limit!: number;
}

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
    @QueryParams() query: GetProtocolsQuery
  ): Promise<object> {
    const { offset, limit, name, category } = query;
    return await this.protocolService.list(offset, limit, name, category);
  }
}

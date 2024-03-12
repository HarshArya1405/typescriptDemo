// Import necessary modules and types
import { JsonController, Post, Get, QueryParams } from 'routing-controllers';
import { IsNumber, IsPositive, IsOptional, IsAlphanumeric } from 'class-validator';

import { ProtocolService } from '../services/protocol.service';

// Define query parameters for getting protocols
class GetProtocolQuery {
    @IsPositive()
    @IsOptional()
    public limit!: number;

    @IsNumber()
    @IsOptional()
    public offset!: number;

    @IsOptional()
    @IsAlphanumeric()
    public name!: string;

    @IsOptional()
    @IsAlphanumeric()
    public category!: string;
}

// Controller for protocol endpoints
@JsonController('/api/v1/protocol')
export class ProtocolController {

    private protocolService: ProtocolService;

    constructor() {
        this.protocolService = new ProtocolService();
    }

    /**
     * Endpoint to fetch and dump protocol data
     * @returns Success message
     */
    @Post('/fetchAndDump')
    public async fetchAndDumpData(): Promise<object> {
        return await this.protocolService.fetchAndDumpData();
    }

    /**
     * Endpoint to list protocols based on query parameters
     * @param query Query parameters for listing protocols
     * @returns List of protocols
     */
    @Get()
    public async list(
        @QueryParams() query: GetProtocolQuery
    ): Promise<object> {
        const { offset, limit, name, category } = query;
        return await this.protocolService.list({ offset, limit, nameFilter: name, categoryFilter: category });
    }
}

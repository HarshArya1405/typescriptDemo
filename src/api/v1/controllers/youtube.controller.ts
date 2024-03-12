// Import necessary modules and types
import { JsonController, Post, Get, Param, Body, QueryParams } from 'routing-controllers';
import { YoutubeService } from '../services/youtube.service';
import { IsAlphanumeric, IsNotEmpty, IsNumber, IsOptional, IsPositive, isUUID } from 'class-validator';
import { BadRequestParameterError } from '../../errors';

class GetYTDraftQuery{
    @IsPositive()
    @IsOptional()
    public limit!: number;

    @IsNumber()
    @IsOptional()
    public offset!: number;

    @IsOptional()
    @IsAlphanumeric()
    public title!: string;
}
class TokenRequestBody {
    @IsNotEmpty()
    code!: string;
}
// Controller for YouTube endpoints
@JsonController('/api/v1/youtube')
export class YoutubeController {

    private youtubeService: YoutubeService;

    constructor() {
        this.youtubeService = new YoutubeService();
    }

    // Create a YouTube for a specific content
    @Get('/authUrl')
    public async getAuthUrl(): Promise<object> {
        try {
            return await this.youtubeService.getAuthUrl();
        } catch (error) {
            console.error('Error creating YouTube:', error);
            throw error;
        }
    }

    // Retrieve all YouTubes for a specific content
    @Post('/:userId/generateToken')
    public async generateToken(
        @Param('userId') userId: string,
        @Body() body: TokenRequestBody
    ): Promise<object> {
        try {
            // If 'id' is defined check if it's a valid UUID format
            if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
            return await this.youtubeService.generateToken(userId,body.code);
        } catch (error) {
            console.error('Error retrieving YouTubes:', error);
            throw error;
        }
    }

    // @Put('/:userId/fetchAndDump')
    // public async fetchAndDump(
    //     @Param('userId') id: string
    // ): Promise<object> {
    //     try {
    //         // If 'id' is defined check if it's a valid UUID format
    //         if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
            
    //         return await this.youtubeService.fetchAndDump(id);
    //     } catch (error) {
    //         console.error('Error creating YouTube:', error);
    //         throw error;
    //     }
    // }

    @Get('/:userId/draftList')
    public async draftList(
        @QueryParams() query: GetYTDraftQuery,
        @Param('userId') id: string,
    ): Promise<object> {
        try {
            // If 'id' is defined check if it's a valid UUID format
            if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
            const { offset, limit, title } = query;
            return await this.youtubeService.draftList(id,{ offset, limit, title});
        } catch (error) {
            console.error('Error creating YouTube:', error);
            throw error;
        }
    }
}

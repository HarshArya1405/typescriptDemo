// Import necessary modules and types
import { VideoContent, Tag, Protocol } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { VideoContentService } from '../services/videoContent.service';
import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// Define the base video content class with common properties
class BaseVideoContent {
  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsNotEmpty()
  thumbnail!: string;

  @IsOptional()
  @IsNumber()
  upVOte!: number;

  @IsOptional()
  @IsNumber()
  downVote!: number;

  @IsOptional()
  @IsString()
  personalNote!: string;

  @IsOptional()
  @IsArray()
  tags!: Tag[];

  @IsOptional()
  @IsNumber()
  protocols!: Protocol[];
}

// Define the body for creating video content
class CreateVideoContentBody extends BaseVideoContent {}

// Define the query parameters for listing video contents
class ListVideoContentsQuery {
  @IsNumber()
  @IsNotEmpty()
  limit!: number;

  @IsNumber()
  @IsNotEmpty()
  offset!: number;

  @IsOptional()
  title!: string;
}

// Controller for video content endpoints
@JsonController('/api/v1/creator/:creatorId/videoContent')
export class VideoContentController {

  private videoContentService: VideoContentService;

  constructor() {
    this.videoContentService = new VideoContentService();
  }

  // Import video content
  @Post('/import')
  @ResponseSchema(VideoContent)
  public async import(
    @Param('creatorId') creatorId: number,
    @Body() body: {videoContent:[]}
    ): Promise<object> {
      try {
        for(const row of body.videoContent){
          await this.createVideoContent(creatorId,row);
        }
        return {success:true};
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Create video content
  @Post('')
  @ResponseSchema(VideoContent)
  public async createVideoContent(
    @Param('creatorId') creatorId: number,
    @Body() body: CreateVideoContentBody
    ): Promise<VideoContent> {
      try {
        const videoContent = new VideoContent();
        videoContent.url = body.url;
        videoContent.title = body.title;
        videoContent.userId = creatorId;
        videoContent.description = body.description;
        videoContent.thumbnail = body.thumbnail;
        videoContent.upVote = body.upVOte;
        videoContent.downVote = body.downVote;
        videoContent.personalNote = body.personalNote;
        videoContent.tags = body.tags;
        videoContent.protocols = body.protocols;
        return await this.videoContentService.create(creatorId,videoContent);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // List video contents
  @Get()
  public async list(
    @Param('creatorId') creatorId: number,
    @QueryParams() query: ListVideoContentsQuery
  ): Promise<object> {
    return await this.videoContentService.list(creatorId, query);
  }

  // Get video content by ID
  @Get('/:id')
  public async get(
    @Param('creatorId') creatorId: number,
    @Param('id') id: number
    ): Promise<VideoContent> {
    try {
      const result = await this.videoContentService.get(creatorId,id);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  // Update video content by ID
  @Put('/:id')
  public async update(
    @Param('creatorId') creatorId: number,
    @Param('id') id: number,
    @Body() newData: BaseVideoContent 
    ): Promise<VideoContent> {
    try {
      const result = await this.videoContentService.update(creatorId,id, newData);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  // Delete video content by ID
  @Delete('/:id')
  public async delete(
    @Param('id') id: number,
    @Param('creatorId') creatorId: number
    ): Promise<{ success: boolean } | { error: string }> {
    try {
      const result = await this.videoContentService.delete(creatorId,id);
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

}

// Import necessary modules and types
import { VideoContent, Tag, Protocol } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { VideoContentService } from '../services/videoContent.service';
import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, isUUID } from 'class-validator';
import { BadRequestParameterError } from '../../errors';
import { In } from 'typeorm';
import { AppDataSource } from '../../../loaders/typeormLoader';

const tagRepository = AppDataSource.getRepository(Tag);
const protocolRepository = AppDataSource.getRepository(Protocol);

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
  @IsArray()
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

  @IsOptional()
  creatorIds!: string;
}

// Controller for video content endpoints
@JsonController('/api/v1/videoContent')
export class VideoContentController {

  private videoContentService: VideoContentService;

  constructor() {
    this.videoContentService = new VideoContentService();
  }

  // Import video content
  @Post('/import/:creatorId')
  @ResponseSchema(VideoContent)
  public async import(
    @Param('creatorId') creatorId: string,
    @Body() body: { videoContent: [] }
  ): Promise<object> {
    try {
      for (const row of body.videoContent) {
        await this.createVideoContent(creatorId, row);
      }
      return { success: true };
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Create video content
  @Post('/:creatorId')
  @ResponseSchema(VideoContent)
  public async createVideoContent(
    @Param('creatorId') creatorId: string,
    @Body() body: CreateVideoContentBody
  ): Promise<VideoContent> {
    try {
      const videoContent = new VideoContent();
      videoContent.url = body.url;
      videoContent.title = body.title;
      videoContent.userId = creatorId;
      videoContent.description = body.description;
      videoContent.thumbnail = body.thumbnail;
      videoContent.personalNote = body.personalNote;

      // Fetch tags based on provided tag IDs
      const tags = await tagRepository.find({ where: { id: In(body.tags) } });
      videoContent.tags = tags;

      // Fetch protocols based on provided protocol IDs
      const protocols = await protocolRepository.find({ where: { id: In(body.protocols) } });
      videoContent.protocols = protocols;

      return await this.videoContentService.create(creatorId, videoContent);
    } catch (error) {
      console.error('Error creating video content:', error);
      throw error;
    }
  }

  // List video contents
  @Get('')
  public async list(
      @QueryParams() query: ListVideoContentsQuery,
      //@QueryParam('creatorId') creatorId: string
  ): Promise<object> {
      try {
          // Pass creatorId and query to service function
          const videoContents = await this.videoContentService.list(query);

          // Return the result in the desired format
          return {
              count: videoContents.length,
              videoContents: videoContents
          };
      } catch (error) {
          console.error('Error listing video content:', error);
          throw error;
      }
  }

  // Get video content by ID
  @Get('/:creatorId/:id')
  public async get(
    @Param('creatorId') creatorId: string,
    @Param('id') id: string
  ): Promise<VideoContent> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.videoContentService.get(creatorId, id);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }
  // Update video content by ID
  @Put('/:creatorId/:id')
  public async update(
    @Param('creatorId') creatorId: string,
    @Param('id') id: string,
    @Body() newData: BaseVideoContent
  ): Promise<VideoContent> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.videoContentService.update(creatorId, id, newData);

      // Fetch tags based on provided tag IDs
      const tags = await tagRepository.find({ where: { id: In(newData.tags) } });
      result.tags = tags;

      // Fetch protocols based on provided protocol IDs
      const protocols = await protocolRepository.find({ where: { id: In(newData.protocols) } });
      result.protocols = protocols;

      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  // Delete video content by ID
  @Delete('/:creatorId/:id')
  public async delete(
    @Param('id') id: string,
    @Param('creatorId') creatorId: string
  ): Promise<{ success: boolean } | { error: string }> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.videoContentService.delete(creatorId, id);
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

}

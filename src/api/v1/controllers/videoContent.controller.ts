// Import necessary modules and types
import { VideoContent, Tag, Protocol } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { VideoContentService } from '../services/videoContent.service';
import { IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, isUUID } from 'class-validator';
import { BadRequestParameterError } from '../../errors';

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
  @IsOptional()
  limit!: number;

  @IsNumber()
  @IsOptional()
  offset!: number;

  @IsOptional()
  title!: string;
}

// Controller for video content endpoints
@JsonController('/api/v1')
export class VideoContentController {

  private videoContentService: VideoContentService;

  constructor() {
    this.videoContentService = new VideoContentService();
  }

  /**
   * Endpoint to import video content for a creator
   * @param creatorId Creator ID
   * @param body Video content data to import
   * @returns Success message if import is successful
   */
  @Post('/creator/:creatorId/videoContent/import')
  @ResponseSchema(VideoContent)
  public async import(
    @Param('creatorId') creatorId: string,
    @Body() body: {videoContent:[]}
    ): Promise<object> {
      try {
        // If 'id' is defined check if it's a valid UUID format
        if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
        for(const row of body.videoContent){
          await this.createVideoContent(creatorId,row);
        }
        return {success:true};
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Endpoint to create video content for a creator
   * @param creatorId Creator ID
   * @param body Video content data to create
   * @returns Created video content
   */
  @Post('/creator/:creatorId/videoContent')
  @ResponseSchema(VideoContent)
  public async createVideoContent(
    @Param('creatorId') creatorId: string,
    @Body() body: CreateVideoContentBody
    ): Promise<VideoContent> {
      try {
         // If 'id' is defined check if it's a valid UUID format
         if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
        const videoContent = new VideoContent();
        // videoContent = { ...videoContent,userId:creatorId,...body}
        videoContent.url = body.url;
        videoContent.title = body.title;
        videoContent.userId = creatorId;
        videoContent.description = body.description;
        videoContent.thumbnail = body.thumbnail;
        videoContent.personalNote = body.personalNote;
        videoContent.tags = body.tags;
        videoContent.protocols = body.protocols;
        return await this.videoContentService.create(creatorId,videoContent);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Endpoint to list video contents for a creator
   * @param creatorId Creator ID
   * @param query Query parameters
   * @returns List of video contents
   */
  @Get('/creator/videoContents')
  public async list(
    @Param('creatorId') creatorId: string,
    @QueryParams() query: ListVideoContentsQuery
  ): Promise<object> {
     // If 'id' is defined check if it's a valid UUID format
     if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
    return await this.videoContentService.list(creatorId, query);
  }

  /**
   * Endpoint to get video content by ID for a creator
   * @param creatorId Creator ID
   * @param id Video content ID
   * @returns Video content information
   */
  @Get('/creator/:creatorId/videoContent/:id')
  public async get(
    @Param('creatorId') creatorId: string,
    @Param('id') id: string
    ): Promise<VideoContent> {
    try {
       // If 'id' is defined check if it's a valid UUID format
       if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
       if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid videoContent, UUID format expected but received ${id}`);
      const result = await this.videoContentService.get(creatorId,id);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  /**
   * Endpoint to update video content by ID for a creator
   * @param creatorId Creator ID
   * @param id Video content ID
   * @param newData New video content data
   * @returns Updated video content
   */
  @Put('/creator/:creatorId/videoContent/:id')
  public async update(
    @Param('creatorId') creatorId: string,
    @Param('id') id: string,
    @Body() newData: BaseVideoContent 
    ): Promise<VideoContent> {
    try {
       // If 'id' is defined check if it's a valid UUID format
      if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid videoContent, UUID format expected but received ${id}`);
      const result = await this.videoContentService.update(creatorId,id, newData);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  /**
   * Endpoint to delete video content by ID for a creator
   * @param creatorId Creator ID
   * @param id Video content ID
   * @returns Success message or error
   */
  @Delete('/creator/:creatorId/videoContent/:id')
  public async delete(
    @Param('id') id: string,
    @Param('creatorId') creatorId: string
    ): Promise<{ success: boolean } | { error: string }> {
    try {
      // If 'id' is defined check if it's a valid UUID format
      if (creatorId && !isUUID(creatorId)) throw new BadRequestParameterError(`Invalid creatorId, UUID format expected but received ${creatorId}`);
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid videoContent, UUID format expected but received ${id}`);
      const result = await this.videoContentService.delete(creatorId,id);
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

}

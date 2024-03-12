// Import necessary modules and types
import { Tag } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TagService } from '../services/tag.service';
import { IsNotEmpty, IsNumber, IsOptional, isUUID } from 'class-validator';
import { BadRequestParameterError } from '../../errors';

// Base tag class with common properties
class BaseTag {
  @IsNotEmpty()
  name!: string;
}

// Create tag body class extending base tag
class CreateTagBody extends BaseTag {}

// List tags query class with limit, offset, and optional name filter
class ListTagsQuery {
  @IsNumber()
  @IsOptional()
  limit!: number;

  @IsNumber()
  @IsOptional()
  offset!: number;

  @IsOptional()
  name!: string;
}

// Controller for tag endpoints
@JsonController('/api/v1/tag')
export class TagController {

  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  /**
   * Endpoint to fetch and dump tag data
   * @returns Success message
   */
  @Post('/fetchAndDump')
  @ResponseSchema(Tag, { isArray: true })
  public async fetchAndDumpData(): Promise<object> {
    return await this.tagService.fetchAndDumpData();
  }

  /**
   * Endpoint to list tags with optional name filter
   * @param query Query parameters including limit, offset, and optional name filter
   * @returns List of tags
   */
  @Get()
  public async list(
    @QueryParams() query: ListTagsQuery
  ): Promise<object> {
    const { offset, limit, name } = query;
    return await this.tagService.list(offset, limit, name);
  }

  /**
   * Endpoint to update a tag
   * @param id ID of the tag to update
   * @param newData Updated tag data
   * @returns Success message or error
   */
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() newData: BaseTag 
    ): Promise<{ success: boolean } | { error: string }> {
    try {
      // If 'id' is defined check if it's a valid UUID format
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid tagId, UUID format expected but received ${id}`);
      const result = await this.tagService.update(id, newData);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      return { error: '500' };
    }
  }

  /**
   * Endpoint to delete a tag
   * @param id ID of the tag to delete
   * @returns Success message or error
   */
  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<{ success: boolean } | { error: string }> {
    try {
      // If 'id' is defined check if it's a valid UUID format
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid tagId, UUID format expected but received ${id}`);
      const result = await this.tagService.delete(id);
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return { error: '500' };
    }
  }

  /**
   * Endpoint to create a new tag
   * @param body Tag data to create
   * @returns Created tag
   */
  @Post('')
  @ResponseSchema(Tag)
  public async createTag(
    @Body() body: CreateTagBody
    ): Promise<Tag> {
      try {
        const { name } = body;
        return await this.tagService.create(name);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }
}

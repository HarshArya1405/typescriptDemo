import { Tag } from '../models/tag.model';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TagService } from '../services/tag.service';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class BaseTag {
  @IsNotEmpty()
  name!: string;
}

class CreateTagBody extends BaseTag {}

class ListTagsQuery {
  @IsNumber()
  @IsNotEmpty()
  limit!: number;

  @IsNumber()
  @IsNotEmpty()
  offset!: number;

  @IsOptional()
  name!: string;
}

@JsonController('/tag')
export class TagController {

  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  @Post()
  @ResponseSchema(Tag, { isArray: true })
  public async fetchAndDumpData(): Promise<Tag[]> {
    return await this.tagService.fetchAndDumpData();
  }

  @Get()
  public async list(
    @QueryParams() query: ListTagsQuery
  ): Promise<object> {
    const { offset, limit, name } = query;
    return await this.tagService.list(offset, limit, name);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() newData: BaseTag
  ): Promise<{ success: boolean } | { error: string }> {
    try {
      const result = await this.tagService.update(id, newData);
      return result;
    } catch (error) {
      console.error('Error updating tag:', error);
      return { error: '500' };
    }
  }

  @Delete('/:id')
  public async delete(@Param('id') id: number): Promise<{ success: boolean } | { error: string }> {
    try {
      const result = await this.tagService.delete(id);
      return result;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return { error: '500' };
    }
  }

  @Post('/createTag')
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

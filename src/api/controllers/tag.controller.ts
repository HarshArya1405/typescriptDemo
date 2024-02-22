import { Tag } from '../models/tag.model';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TagService } from '../services/tag.service';
import { IsNotEmpty, IsOptional } from 'class-validator';

class UpdateTagDto {
  @IsOptional()
  @IsNotEmpty()
  name!: string;
}

class CreateTagDto {
  @IsNotEmpty()
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
    @QueryParams() query: { offset?: number; limit?: number; name?: string }
  ): Promise<object> {
    const { offset = 0, limit = 10, name = '' } = query;
    return await this.tagService.list(offset, limit, name);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() newData: UpdateTagDto
  ): Promise<{ success: boolean } | { error: string }> {
    try {
      if (!newData.name) {
        throw new Error('Name is required');
      }
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
    @Body() body: CreateTagDto
  ): Promise<Tag> {
    try {
      if (!body.name) {
        throw new Error('Name is required');
      }
      const { name } = body;
      return await this.tagService.create(name);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }
}

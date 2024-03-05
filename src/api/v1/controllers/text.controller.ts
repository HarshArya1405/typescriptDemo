// Import necessary modules and types
import { Text } from '../../models';
import { JsonController, Post, Get, Put, Delete, Param, Body, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TextService } from '../services/text.service';
import { IsNotEmpty, IsNumber, IsOptional, IsString, isUUID } from 'class-validator';
import { BadRequestParameterError } from '../../errors';

// Define the base text content class with common properties
class BaseTextContent {
  @IsNotEmpty()
  content!: string;

  @IsNotEmpty()
  text!: string;

  @IsNotEmpty()
  caption!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  meta_information!: string;
}

// Define the body for creating text content
class CreateTextContentBody extends BaseTextContent {}

// Define the query parameters for listing text contents
// Define the query parameters for listing text contents
class ListTextContentsQuery {
    @IsOptional()
    @IsString()
    content!: string;
  
    @IsOptional()
    @IsNumber()
    limit?: number;
  
    @IsOptional()
    @IsNumber()
    offset?: number;
  }
  

// Controller for text content endpoints
@JsonController('/api/v1/creator/:creatorId/textContent')
export class TextContentController {

  private textContentService: TextService;

  constructor() {
    this.textContentService = new TextService();
  }

  // Create text content
  @Post('')
  @ResponseSchema(Text)
  public async createTextContent(
    @Param('creatorId') creatorId: string,
    @Body() body: CreateTextContentBody
    ): Promise<Text> {
      try {
        const textContent = new Text();
        textContent.content = body.content;
        textContent.text = body.text;
        textContent.caption = body.caption;
        textContent.description = body.description;
        textContent.meta_information = body.meta_information;
        return await this.textContentService.create(creatorId, textContent);
    } catch (error) {
      console.error('Error creating text content:', error);
      throw error;
    }
  }

  // List text contents
  @Get('')
  public async list(
    @Param('creatorId') creatorId: string,
    @QueryParams() query: ListTextContentsQuery
  ): Promise<object> {
    return await this.textContentService.list(creatorId, query);
  }

  // Get text content by ID
  @Get('/:id')
  public async get(
    @Param('id') id: string
    ): Promise<Text> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.textContentService.get(id);
      return result;
    } catch (error) {
      console.error('Error getting text content:', error);
      throw error;
    }
  }

  // Update text content by ID
  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() newData: BaseTextContent 
    ): Promise<Text> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.textContentService.update(id, newData);
      return result;
    } catch (error) {
      console.error('Error updating text content:', error);
      throw error;
    }
  }

  // Delete text content by ID
  @Delete('/:id')
  public async delete(
    @Param('id') id: string
    ): Promise<{ success: boolean } | { error: string }> {
    try {
      if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
      const result = await this.textContentService.delete(id);
      return result;
    } catch (error) {
      console.error('Error deleting text content:', error);
      throw error;
    }
  }
}

import { Tag } from '../models/tag.model';
import { JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TagService } from '../services/tag.service';

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
}

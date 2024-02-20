import { IsNotEmpty, IsNumber, ValidateNested, IsBoolean, IsPositive, IsAlpha,IsOptional} from 'class-validator';
import {
    Body, Delete, Get, JsonController, Param, Post, Put, QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import {Task} from '../models/task.model';
import { TaskService } from '../services/task.service';

const taskService =  new TaskService();

class BaseTask {
    @IsNotEmpty()
    public title!: string;

    @IsOptional()
    public description!: string;

    @IsBoolean()
    public published!: boolean;
}

export class TaskResponse extends BaseTask {
    @IsNumber()
    public id!: number;

    @ValidateNested()
    public task!: TaskResponse;

}

class CreateTaskBody extends BaseTask {}

class GetTasksQuery {
    @IsPositive()
    public limit!: number;

    @IsNumber()
    public offset!: number;

    @IsOptional()
    @IsAlpha()
    public title!: string;

    @IsOptional()
    @IsBoolean()
    public published!: boolean;
}

// @Authorized()
@JsonController('/task')
// @OpenAPI({ security: [{ basicAuth: [] }] })
export class TaskController {

    constructor() {
    }

    @Post()
    @ResponseSchema(TaskResponse)
    public async create(@Body() body: CreateTaskBody): Promise<Task> {
        const task = new Task();
        task.title = body.title;
        task.description = body.description;
        task.published = body.published;
        return taskService.create(task);
    }

    @Get('/:id')
    @ResponseSchema(TaskResponse)
    public async get(@Param('id') id: number): Promise<Task | null> {
        return taskService.get(id);
    }

    @Get()
    @ResponseSchema(TaskResponse, { isArray: true })
    public async list(@QueryParams() query: GetTasksQuery): Promise<object> {
        return taskService.list(query);
    }

    @Put('/:id')
    @ResponseSchema(TaskResponse)
    public async update(@Param('id') id: number, @Body() body: BaseTask): Promise<object> {
        const task = new Task();
        task.title = body.title;
        task.description = body.description;
        task.published = body.published;
        return taskService.update(id, task);
    }

    @Delete('/:id')
    public async delete(@Param('id') id: number): Promise<void> {
        await taskService.delete(id);
    }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TaskService } from './task.service';
import { GetUser } from '../auth/decorator';
import { CreateTaskDto, EditTaskDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post()
    createTask(@GetUser('id') userId: number, @Body() dto: CreateTaskDto){
        return this.taskService.createTask(userId, dto);
    }

    @Get()
    getTasks(@GetUser('id') userId: number){
        return this.taskService.getTasks(userId);
    }

    @Get(':id')
    getTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number){
        return this.taskService.getTask(userId, taskId);
    }

    @Patch(':id')
    editTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number, @Body() dto: EditTaskDto){
        return this.taskService.editTask(userId, taskId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTask(@GetUser('id') userId: number, @Param('id', ParseIntPipe) taskId: number){
        return this.taskService.deleteTask(userId, taskId);
    }

}

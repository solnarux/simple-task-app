import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto, EditTaskDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async createTask(userId: number, dto: CreateTaskDto) {
        const task = await this.prisma.task.create({data: {userId, ...dto}})
        return task;
    }
    getTasks(userId: number) {
        return this.prisma.task.findMany({ where: { userId } });
    }
    getTask(userId: number, taskId: number) {
        return this.prisma.task.findFirst({ where: { id: taskId, userId } });;
    }
    async editTask(userId: number, taskId: number, dto: EditTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if(!task || task.userId !== userId) throw new ForbiddenException('Denied access');
        return this.prisma.task.update({ where: { id: taskId }, data: dto });

    }
    
    async deleteTask(userId: number, taskId: number) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if(!task || task.userId !== userId) throw new ForbiddenException('Denied access');
        await this.prisma.task.delete({ where: { id: taskId } });
    }
}

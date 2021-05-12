import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {

    }
    

    async getTasks(filterDto: GetTasksFilterDto) {
        return this.taskRepository.getTasks(filterDto);
    }

    /*getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;
        let task = this.getAllTask();

        if (status) {
            task = task.filter(task => task.status === status);
        }

        if (search) {
            task = task.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search),
            );
        }
        return task;
    }*/

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID '${id}' not found`);
        }
        return found;
    }



    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }


    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        console.log(result);
        if(result.affected===0){
            throw new NotFoundException(`Task with ID '${id}' not found`);
        }
    }

    async updateTaskStatusById(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}

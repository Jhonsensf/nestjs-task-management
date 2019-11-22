import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-to';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ){}

  async getTaskById(id: number): Promise<Task>{
    const found = await this.taskRepository.findOne(id); 

    if (!found){
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    return this.taskRepository.createTask(createTaskDto)
  }
  

  async deleteTask(id: number): Promise<void>{
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0){ 
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]>{
    return this.taskRepository.getTasks(filterDto)
  }
}

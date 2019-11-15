import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model'
import * as uuid from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-to';

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(){
    return this.tasks;
  }

  getAllTasksWithFitler(filterDto: GetTaskFilterDto){
    const {status, search } = filterDto;
    let tasks = this.getAllTasks();
    
    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task => 
        task.title.includes(search) || 
        task.description.includes(search)
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);

    if (!found){
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }
    return found
  }

  createTask(createTaskDto: CreateTaskDto): Task{
    const {title, description} = createTaskDto;
    const task: Task ={
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void{
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task{
    const task = this.getTaskById(id);
    task.status = status;
    return task
  }
}
import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-to';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService){};

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
    console.log(filterDto);
    if (Object.keys(filterDto).length){
      return this.tasksService.getAllTasksWithFitler(filterDto)
    }else{
      return this.tasksService.getAllTasks()
    }
    
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto){
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string){
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status', new TaskStatusValidationPipe) status: TaskStatus
  ){
    return this.tasksService.updateTaskStatus(id, status);
  }
}

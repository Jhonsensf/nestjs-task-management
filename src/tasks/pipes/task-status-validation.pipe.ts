import {PipeTransform, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import { TaskStatus } from '../../tasks/task-status.enum'

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]
  transform( value: any, metadata: ArgumentMetadata){
    console.log('value', value);
    value = value.toUpperCase();
    
    if (!this.isStatusValid(value)){
      throw new BadRequestException(`${value} is an invalid status`)
    }

    return value;

  }

  private isStatusValid(status: any){
    const idx = this.allowedStatuses.indexOf(status)
    return idx !== -1
  }
}
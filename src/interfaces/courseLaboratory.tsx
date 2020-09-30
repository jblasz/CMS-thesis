import { CourseTask, ICourseTask } from './courseTask';

export interface ITaskToGroupMapping {
  [groupId: string]: ICourseTask
}

export interface TaskToGroupMapping extends ITaskToGroupMapping {
  [groupId: string]: CourseTask
}

export interface ICourseLaboratory {
  _id: string
  name: string
  nameShort: string
  description: string
  tasks: ITaskToGroupMapping
  location: string
  starts?: Date
  ends?: Date
}

export class CourseLaboratory implements ICourseLaboratory {
  _id = ''

  description = ''

  tasks: TaskToGroupMapping = {}

  name = ''

  nameShort = ''

  location = ''

  starts?: Date

  ends?: Date

  constructor(o?: ICourseLaboratory) {
    if (o) {
      this._id = o._id || '';
      this.description = o.description || '';
      this.name = o.name || '';
      this.nameShort = o.nameShort || '';
      this.location = o.location || '';
      if (o.starts) {
        this.starts = new Date(o.starts);
      }
      if (o.ends) {
        this.ends = new Date(o.ends);
      }
      if (o.tasks) {
        this.tasks = Object.keys(o.tasks).reduce(
          (newMapping: TaskToGroupMapping, groupUUID) => (
            {
              ...newMapping,
              [groupUUID]: new CourseTask(o.tasks[groupUUID]),
            }),
          {},
        );
      }
    }
  }
}

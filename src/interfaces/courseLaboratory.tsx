import joi from 'joi';
import { CourseTask, ICourseTask } from './courseTask';
import { Validable, ValResult } from './misc';

export interface ITaskToGroupMapping {
  [groupId: string]: ICourseTask
}

export interface TaskToGroupMapping extends ITaskToGroupMapping {
  [groupId: string]: CourseTask
}

export interface ICourseLaboratory {
  _id: string
  name: string
  description: string
  tasks: ITaskToGroupMapping
}

export class CourseLaboratory implements ICourseLaboratory, Validable {
  _id = ''

  description = ''

  tasks: TaskToGroupMapping = {}

  name = ''

  constructor(o?: ICourseLaboratory | string) {
    if (typeof o === 'string') {
      this._id = o;
    } else if (o) {
      this._id = o._id || '';
      this.description = o.description || '';
      this.name = o.name || '';
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

  validate(): ValResult {
    const root = Object.keys(this.tasks)
      .map((gid) => ({ ...this.tasks[gid].validate(), gid, _id: this.tasks[gid]._id }))
      .find((x) => !x.ok);

    if (root) {
      return { ok: false, error: `Task ${root._id} for group ${root.gid} error - ${root.error}` };
    }
    const { error } = joi.object().keys({
      description: joi.string().required(),
      name: joi.string().required(),
    }).validate({ description: this.description, name: this.name });
    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, json: JSON.stringify(this) };
  }
}

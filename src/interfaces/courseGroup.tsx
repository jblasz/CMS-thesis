import joi from 'joi';
import { CourseGroupStudent, ICourseGroupStudent } from './courseGroupStudent';
import { Validable, ValResult } from './misc';

export interface ICourseGroup {
  _id: string
  name: string
  students: ICourseGroupStudent[]
}

export class CourseGroup implements ICourseGroup, Validable {
  _id = ''

  name = ''

  students: CourseGroupStudent[] = []

  constructor(o?:ICourseGroup | string) {
    if (typeof o === 'string') {
      this._id = o;
    } else if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      if (o.students && o.students.length) {
        this.students = o.students.map((student) => new CourseGroupStudent(student));
      }
    }
  }

  validate(): ValResult {
    const { error } = joi.object().keys({
      _id: joi.string().optional(),
      name: joi.string().required(),
      students: joi.array().items(joi.object()),
    }).validate({ _id: this._id, name: this.name, students: this.students });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, json: JSON.stringify(this) };
  }
}

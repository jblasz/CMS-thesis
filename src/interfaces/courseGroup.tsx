import { IStudent, Student } from './student';

export interface ICourseGroup {
  _id: string
  name: string
  students: IStudent[]
}

export class CourseGroup implements ICourseGroup {
  _id = ''

  name = ''

  students: Student[] = []

  constructor(o?:ICourseGroup) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      if (o.students && o.students.length) {
        this.students = o.students.map((student) => new Student(student));
      }
    }
  }
}

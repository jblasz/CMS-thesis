import { IStudent, Student } from './student';

export interface ICourseGroup {
  _id: string
  students: IStudent[]
}

export class CourseGroup implements ICourseGroup {
  _id = ''

  students: Student[] = []

  constructor(o?:ICourseGroup) {
    if (o) {
      this._id = o._id || '';
      if (o.students && o.students.length) {
        this.students = o.students.map((student) => new Student(student));
      }
    }
  }
}

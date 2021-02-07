import { SubmissionGrade } from './misc';

export interface ICourseGroupStudent {
  _id: string
  name: string
  email: string
  usosId: string
  grade?: SubmissionGrade
  contactEmail: string
}

export class CourseGroupStudent implements ICourseGroupStudent {
  _id = ''

  name = ''

  email = ''

  contactEmail = ''

  usosId = ''

  grade?: SubmissionGrade

  constructor(o?: ICourseGroupStudent) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.email = o.email || '';
      this.usosId = o.usosId || '';
      this.contactEmail = o.contactEmail || '';
      if (o.grade) {
        this.grade = o.grade;
      }
    }
  }
}

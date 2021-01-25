import { SubmissionGrade } from './misc';

export interface ICourseGroupStudent {
  _id: string
  name: string
  email: string
  usosID: string
  grade?: SubmissionGrade
  contactEmail: string
}

export class CourseGroupStudent implements ICourseGroupStudent {
  _id = ''

  name = ''

  email = ''

  contactEmail = ''

  usosID = ''

  grade?: SubmissionGrade

  constructor(o?: ICourseGroupStudent) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.email = o.email || '';
      this.usosID = o.usosID || '';
      this.contactEmail = o.contactEmail || '';
      if (o.grade) {
        this.grade = o.grade;
      }
    }
  }
}

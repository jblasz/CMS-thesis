import { CourseLanguage } from './course';
import { SubmissionGrade } from './resource';
import { IResourceLink } from './resourceLink';

export interface IStudentCourse {
  _id: string
  name: string
  description: string
  language: CourseLanguage
  semester: string
  links: IResourceLink[]
  laboratories: StudentCourseLaboratory[]
  groupId: string
  groupName: string
  active: boolean
}

export interface StudentCourseLaboratory {
  _id: string
  name: string
  grade?: SubmissionGrade
  latestSubmissionId?: string
}

export class StudentCourse implements IStudentCourse {
  _id = ''

  name = ''

  description = ''

  language: CourseLanguage = CourseLanguage.EN

  semester = ''

  links: IResourceLink[] = []

  laboratories: StudentCourseLaboratory[] = []

  active = true

  groupId = ''

  groupName = ''

  constructor(o?: IStudentCourse) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
      this.language = o.language || CourseLanguage.EN;
      this.semester = o.semester || '';
      this.links = o.links || [];
      this.laboratories = o.laboratories || [];
      this.active = o.active || true;
      this.groupId = o.groupId || '';
      this.groupName = o.groupName || '';
    }
  }
}

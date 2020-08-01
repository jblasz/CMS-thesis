import { IResourceLink } from './resourceLink';
import { CourseLaboratory, ICourseLaboratory } from './courseLaboratory';
import { ICourseGroup, CourseGroup } from './courseGroup';

export enum CourseLanguage {
  EN = 'en',
  PL = 'pl'
}

export interface ICourse {
  _id: string
  name: string
  description: string
  language: CourseLanguage
  semester: string
  links: IResourceLink[]
  laboratories: ICourseLaboratory[]
  groups: ICourseGroup[]
}

export class Course implements ICourse {
  _id = ''

  name = ''

  description = ''

  language: CourseLanguage = CourseLanguage.EN

  semester = 'NO_SEMESTER_ASSIGNED'

  links: IResourceLink[] = []

  laboratories: CourseLaboratory[] = []

  groups: CourseGroup[] = []

  constructor(o?: ICourse) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
      this.language = o.language || 'en';
      this.semester = o.semester || 'NO_SEMESTER_ASSIGNED';
      this.links = o.links || [];
      if (o.laboratories && o.laboratories.length) {
        this.laboratories = o.laboratories.map((lab) => new CourseLaboratory(lab));
      }
      if (o.groups && o.groups.length) {
        this.groups = o.groups.map((group) => new CourseGroup(group));
      }
    }
  }
}

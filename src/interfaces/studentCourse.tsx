import { CourseLanguage } from './course';
import { SubmissionGrade } from './misc';

export interface IStudentCourse {
  _id: string
  name: string
  description: string
  language: CourseLanguage
  semester: string
  laboratories: IStudentCourseLaboratory[]
  groupId: string
  groupName: string
  active: boolean
  grade?: SubmissionGrade
}

export interface IStudentCourseLaboratory {
  _id: string
  name: string
  grade?: SubmissionGrade
  latestSubmissionId?: string
  resourceId?: string
  dateFrom?: Date
  dateTo?: Date
}

export function StudentCourseLaboratory(o: IStudentCourseLaboratory): IStudentCourseLaboratory {
  return {
    _id: o._id || '',
    name: o.name || '',
    ...(o.resourceId ? { resourceId: o.resourceId } : {}),
    ...(o.dateFrom ? { dateFrom: new Date(o.dateFrom) } : {}),
    ...(o.dateTo ? { dateTo: new Date(o.dateTo) } : {}),
    ...(o.grade ? { grade: o.grade } : {}),
    ...(o.latestSubmissionId ? { latestSubmissionId: o.latestSubmissionId } : {}),
  };
}

export function StudentCourse(o: IStudentCourse): IStudentCourse {
  return {
    _id: o._id || '',
    name: o.name || '',
    description: o.description || '',
    language: o.language || CourseLanguage.EN,
    semester: o.semester || '',
    laboratories: (o.laboratories && o.laboratories.map((x) => StudentCourseLaboratory(x))) || [],
    active: o.active || true,
    groupId: o.groupId || '',
    groupName: o.groupName || '',
    ...(o.grade ? { grade: o.grade } : {}),
  };
}

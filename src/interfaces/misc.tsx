export enum SubmissionGrade {
  A = '5.0',
  B_PLUS = '4.5',
  B = '4.0',
  C_PLUS = '3.5',
  C = '3.0',
  F = '2.0'
}
export interface ValResult {
  ok: boolean
  error?: string
  json?: string
}

export interface Validable {
  validate: () => ValResult
}

export interface ICourseGroupMeta {
  groupId: string
  groupName: string
  courseId: string
  courseName: string
  active: boolean
}

export interface ICourseGroupMetaWithGrade extends ICourseGroupMeta {
  grade?: SubmissionGrade
}

export interface ICourseLabGroupMeta extends ICourseGroupMeta {
  labId: string
  labName: string
}

export interface ICourseLabGroupMetaWithDates extends ICourseLabGroupMeta {
  dateFrom: Date
  dateTo: Date
}

export function CourseLabGroupMetaWithDates(
  g: ICourseLabGroupMetaWithDates,
): ICourseLabGroupMetaWithDates {
  return {
    ...g,
    dateFrom: new Date(g.dateFrom),
    dateTo: new Date(g.dateTo),
  };
}

export interface IPendingLaboratory extends ICourseLabGroupMeta {
  dateFrom: Date
  dateTo: Date
}

export function PendingLaboratory(lab: IPendingLaboratory): IPendingLaboratory {
  return {
    ...lab,
    dateFrom: new Date(lab.dateFrom),
    dateTo: new Date(lab.dateTo),
  };
}

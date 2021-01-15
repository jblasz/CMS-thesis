import { SubmissionGrade } from './misc';
import { IStudent } from './student';

export interface IUsedBy {
  courseId: string
  courseName: string
  labId: string
  labName: string
  groupId: string
}

export enum Permission {
  ALL = 'all',
  LOGGED_IN = 'loggedIn',
  TASK_GROUP = 'taskGroup',
  NONE = 'none'
}

export interface IResourceMeta {
  _id: string
  name: string
  permission: Permission
  usedBy: IUsedBy[]
}

export interface ISubmissionMeta {
  _id: string
  submittedBy: IStudent
  forCourseID: string
  forCourseName: string
  forGroupID: string
  forGroupName: string
  forLabID: string
  forLabName: string
  submittedAt: Date
  note: string
  final: boolean
  grade?: SubmissionGrade
}

export function SubmissionMeta(s: ISubmissionMeta): ISubmissionMeta {
  return {
    ...s,
    submittedAt: new Date(s.submittedAt),
  };
}

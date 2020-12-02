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

export enum SubmissionGrade {
  A = '5.0',
  B_PLUS = '4.5',
  B = '4.0',
  C_PLUS = '3.5',
  C = '3.0',
  F = '2.0'
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

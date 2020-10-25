import { IStudent } from './student';

export interface UsedBy {
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

export interface ResourceMeta {
  _id: string
  name: string
  permission: Permission
  usedBy: UsedBy[]
}

export interface SubmissionMeta {
  _id: string
  submittedBy: IStudent
  forLabID?: string
  forLabName?: string
  submittedAt: Date
  note: string
}

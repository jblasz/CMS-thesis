import { SubmissionGrade } from './misc';
import { IStudent, Student } from './student';

export interface IUsedBy {
  courseId: string
  courseName: string
  labId: string
  labName: string
  groupId: string
}

export function NormalizeUsedBy(o?: IUsedBy): IUsedBy {
  if (o) {
    return {
      courseId: o.courseId || '',
      courseName: o.courseName || '',
      groupId: o.groupId || '',
      labId: o.labId || '',
      labName: o.labName || '',
    };
  }
  return {
    courseId: '',
    courseName: '',
    groupId: '',
    labId: '',
    labName: '',
  };
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

export function NormalizeResourceMeta(o?: IResourceMeta): IResourceMeta {
  if (o) {
    return {
      _id: o._id || '',
      name: o.name || '',
      permission: o.permission || Permission.NONE,
      usedBy: o.usedBy && o.usedBy.map((x) => NormalizeUsedBy(x)),
    };
  }
  return {
    _id: '',
    name: '',
    permission: Permission.NONE,
    usedBy: [],
  };
}

export interface ISubmissionMeta {
  _id: string
  submittedBy: IStudent
  forCourseId: string
  forCourseName: string
  forGroupId: string
  forGroupName: string
  forLabId: string
  forLabName: string
  submittedAt: Date
  note: string
  final: boolean
  grade?: SubmissionGrade
}

export function SubmissionMeta(s: ISubmissionMeta): ISubmissionMeta {
  if (s) {
    return {
      _id: s._id || '',
      submittedBy: new Student(s.submittedBy),
      final: !!s.final,
      forCourseId: s.forCourseId || '',
      forCourseName: s.forCourseName || '',
      forGroupId: s.forGroupId || '',
      forGroupName: s.forGroupName || '',
      forLabId: s.forLabId || '',
      forLabName: s.forLabName || '',
      note: s.note || '',
      submittedAt: new Date(s.submittedAt),
      ...(s.grade ? { grade: s.grade } : {}),
    };
  }
  return {
    _id: '',
    final: false,
    forCourseId: '',
    forCourseName: '',
    forGroupId: '',
    forGroupName: '',
    forLabId: '',
    forLabName: '',
    note: '',
    submittedAt: new Date(0),
    submittedBy: new Student(),
  };
}

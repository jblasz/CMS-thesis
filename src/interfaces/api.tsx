import { IArticleMeta, IArticle } from './article';
import { Code } from './code';
import { ICourse } from './course';
import { ICourseGroup } from './courseGroup';
import { ICourseLaboratory } from './courseLaboratory';
import { ICourseTask } from './courseTask';
import { IResourceMeta, SubmissionGrade, ISubmissionMeta } from './resource';
import { IStudent } from './student';
import { IStudentCourse } from './studentCourse';

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
  startsAt: Date
  endsAt: Date
}

export function CourseLabGroupMetaWithDates(
  g: ICourseLabGroupMetaWithDates,
): ICourseLabGroupMetaWithDates {
  return {
    ...g,
    startsAt: new Date(g.startsAt),
    endsAt: new Date(g.endsAt),
  };
}

export interface IApiPostResponse {
  ok: boolean
}

export interface IGetCoursesResponse {
  courses: ICourse[]
}

export interface IGetCourseResponse {
  course: ICourse
}

export interface IGetCourseGroupResponse {
  courseId: string
  courseName: string
  group: ICourseGroup
}

export interface IGetLaboratoryResponse {
  courseId: string
  courseName: string
  laboratory: ICourseLaboratory
}

export interface IPostCourseResponse extends IApiPostResponse {
  course: ICourse
}

export interface IPostCourseGroupResponse extends IApiPostResponse {
  group: ICourseGroup
}

export interface IPutCourseLaboratoryResponse extends IApiPostResponse {
  laboratory: ICourseLaboratory
}

export interface IPutCourseLaboratoryTaskResponse extends IApiPostResponse {
  task: ICourseTask
}

export interface IPatchCourseGroupStudentResponse extends IApiPostResponse {
  group: ICourseGroup
}

export enum PostCodeResponseType {
  COURSE_SIGNUP = 'courseSignup',
}

export interface IPostCodeResponse extends IApiPostResponse {
  type: PostCodeResponseType
  courseSignup?: ICourseGroupMeta
}

export interface IGetCodesResponse {
  codes: Code[]
}

export interface IPostCodeNewResponse {
  code: Code
}

export interface IGetResourcesResponse {
  resources: IResourceMeta[]
}

export interface IGetResourceResponse {
  resource: IResourceMeta
}

export interface IPutResourceResponse extends IGetResourceResponse, IApiPostResponse {
}

export interface IGetStudentsResponse {
  students: IStudent[]
}

export interface IGetUserResponse {
  student: IStudent
  attends: ICourseGroupMeta[]
  submissions: ISubmissionMeta[]
}

export interface IPostUserResponse {
  student: IStudent
  attends: ICourseGroupMeta[]
  submissions: ISubmissionMeta[]
}

export interface GetStudentResponse {
  student: IStudent
  attends: ICourseGroupMetaWithGrade[]
  submissions: ISubmissionMeta[]
}

export interface PatchStudentResponse extends IApiPostResponse {
  student: IStudent
}

export interface IGetSubmissionsResponse {
  submissions: ISubmissionMeta[]
}

export interface IGetSubmissionResponse {
  submission: ISubmissionMeta
}

export interface IPatchSubmissionResponse extends IApiPostResponse {
  submission: ISubmissionMeta
}

export interface IPendingLaboratory extends ICourseLabGroupMeta {
  startsAt: Date
  endsAt: Date
}

export interface IGetDashboardLaboratoriesResponse {
  laboratories: IPendingLaboratory[]
}

export function PendingLaboratory(lab: IPendingLaboratory): IPendingLaboratory {
  return {
    ...lab,
    startsAt: new Date(lab.startsAt),
    endsAt: new Date(lab.endsAt),
  };
}

export interface IPatchResourceResponse extends IApiPostResponse {
  resource: IResourceMeta
}

export interface IGetAdminDashboardResponse {
  unmarkedSolutionsCount: number
}

export interface IGetArticlesResponse {
  articles: IArticleMeta[]
}

export interface IGetArticleResponse {
  article: IArticle
}

export interface IPutArticleResponse extends IApiPostResponse {
  article: IArticle
}

export interface IGetStudentDashboardResponse {
  upcoming: ICourseLabGroupMetaWithDates[]
}

export interface IGetStudentCoursesResponse {
  courses: ICourseGroupMetaWithGrade[]
}

export interface IGetStudentCourseResponse {
  course: IStudentCourse
}

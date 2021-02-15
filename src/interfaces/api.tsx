import { IArticleMeta, IArticle } from './article';
import { ICode } from './code';
import { ICourse } from './course';
import { ICourseGroup } from './courseGroup';
import { ICourseLaboratory } from './courseLaboratory';
import { ICourseTask } from './courseTask';
import {
  ICourseGroupMeta, ICourseGroupMetaWithGrade, IPendingLaboratory, ICourseLabGroupMetaWithDates,
} from './misc';
import { IResourceMeta, ISubmissionMeta } from './resource';
import { IStudent } from './student';
import { IStudentCourse } from './studentCourse';

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
  codes: ICode[]
}

export interface IPostCodeNewResponse {
  code: ICode
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
  attends: ICourseGroupMetaWithGrade[]
  submissions: ISubmissionMeta[]
}

export interface IPostUserResponse {
  token?: string
  student: IStudent
  attends: ICourseGroupMetaWithGrade[]
  submissions: ISubmissionMeta[]
}

export interface IUserResponse {
  isActive: boolean,
  isAdmin: boolean,
  _id: string,
  googleId: string,
  fullname?: string,
  name: string,
  contactEmail: string
  email: string,
  registeredAt: string
}

export interface IPostUserAdminResponse {
  token: string
  user: IUserResponse
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

export interface IGetDashboardLaboratoriesResponse {
  laboratories: IPendingLaboratory[]
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

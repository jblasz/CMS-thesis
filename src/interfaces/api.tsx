import { ICourse } from './course';
import { ICourseGroup } from './courseGroup';
import { ICourseLaboratory } from './courseLaboratory';

interface ApiPostResponse {
  ok: boolean
}

export interface GetCoursesResponse {
  courses: ICourse[]
}

export interface GetCourseResponse {
  course: ICourse
}

export interface GetCourseGroupResponse {
  group: ICourseGroup
}

export interface GetLaboratoryResponse {
  laboratory: ICourseLaboratory
}

export interface PostCourseResponse extends ApiPostResponse {
  course: ICourse
}

export interface PostCourseGroupResponse extends ApiPostResponse {
  group: ICourseGroup
}

export enum PostCodeResponseType {
  COURSE_SIGNUP = 'courseSignup',
}

export interface PostCodeResponse extends ApiPostResponse {
  type: PostCodeResponseType
  courseSignup?: ICourse
}

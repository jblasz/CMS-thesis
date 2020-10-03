import { ICourse } from './course';
import { ICourseGroup } from './courseGroup';
import { ICourseLaboratory } from './courseLaboratory';
import { ResourceMeta } from './resource';

export interface ApiPostResponse {
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

export interface PutCourseLaboratoryResponse extends ApiPostResponse {
  laboratory: ICourseLaboratory
}

export interface PatchCourseGroupStudentResponse extends ApiPostResponse {
  group: ICourseGroup
}

export enum PostCodeResponseType {
  COURSE_SIGNUP = 'courseSignup',
}

export interface PostCodeResponse extends ApiPostResponse {
  type: PostCodeResponseType
  courseSignup?: ICourse
}

export interface GetResourcesResponse {
  resources: ResourceMeta[]
}

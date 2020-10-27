import { Course, ICourse } from './course';
import { ICourseGroup } from './courseGroup';
import { ICourseLaboratory } from './courseLaboratory';
import { ResourceMeta, SubmissionMeta } from './resource';
import { Student } from './student';

export interface CourseGroupMeta {
  groupId: string
  groupName: string
  courseId: string
  courseName: string
  active: boolean
}

export interface CourseLabGroupMeta extends CourseGroupMeta {
  labId: string
  labName: string
}

export interface ApiPostResponse {
  ok: boolean
}

export interface GetCoursesResponse {
  courses: Course[]
}

export interface GetCourseResponse {
  course: ICourse
}

export interface GetCourseGroupResponse {
  courseId: string
  courseName: string
  group: ICourseGroup
}

export interface GetLaboratoryResponse {
  courseId: string
  courseName: string
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

export interface GetStudentsResponse {
  students: Student[]
}

export interface GetStudentResponse {
  student: Student
  attendedCourseGroupLabs: CourseGroupMeta[]
  submissions: SubmissionMeta[]
}

export interface GetSubmissionsResponse {
  submissions: SubmissionMeta[]
}

export interface GetSubmissionResponse {
  submission: SubmissionMeta
}

export interface PatchSubmissionResponse extends ApiPostResponse {
  submission: SubmissionMeta
}

export interface PendingLaboratory extends CourseLabGroupMeta {
  startsAt: Date
  endsAt: Date
}

export interface GetDashboardLaboratoriesResponse {
  laboratories: PendingLaboratory[]
}

export interface PatchResourceResponse extends ApiPostResponse {
  resource: ResourceMeta
}

export interface GetAdminDashboardResponse {
  unmarkedSolutionsCount: number
}

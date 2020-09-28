import { Course } from '../../interfaces/course';
import {
  getCoursesListMockResponse,
  getCourseMockResponse,
  getLaboratoryMockResponse,
  setCourseMockResponse,
  getCourseGroupMockResponse,
  setCourseGroupResponse,
  deleteGroupMockResponse,
  deleteLaboratoryMockResponse, patchCourseGroupStudentMockResponse,
} from '../mocks/in-memory-course-mocks';
import { CourseGroup } from '../../interfaces/courseGroup';
import {
  GetCoursesResponse,
  GetCourseResponse,
  GetCourseGroupResponse,
  PostCourseResponse,
  PostCourseGroupResponse,
  GetLaboratoryResponse,
  ApiPostResponse,
  PatchCourseGroupStudentResponse,
} from '../../interfaces/api';

export async function getCourses(): Promise<GetCoursesResponse> {
  return getCoursesListMockResponse();
}

export async function getCourse(_id: string): Promise<GetCourseResponse> {
  return getCourseMockResponse(_id);
}

export async function getCourseGroup(_id: string): Promise<GetCourseGroupResponse> {
  return getCourseGroupMockResponse(_id);
}

export async function setCourse(course: Course): Promise<PostCourseResponse> {
  return setCourseMockResponse(course);
}

export async function setCourseGroup(group: CourseGroup): Promise<PostCourseGroupResponse> {
  return setCourseGroupResponse(group);
}

export async function deleteCourseGroup(_id: string): Promise<ApiPostResponse> {
  return deleteGroupMockResponse(_id);
}

export async function patchCourseGroupStudent(
  courseID: string, groupID: string, studentID: string,
): Promise<PatchCourseGroupStudentResponse> {
  return patchCourseGroupStudentMockResponse(courseID, groupID, studentID);
}

export async function getLaboratory(_id: string): Promise<GetLaboratoryResponse> {
  return getLaboratoryMockResponse(_id);
}

export async function deleteLaboratory(_id: string): Promise<ApiPostResponse> {
  return deleteLaboratoryMockResponse(_id);
}

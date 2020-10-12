import { Course } from '../../interfaces/course';
import {
  getCoursesListMockResponse,
  getCourseMockResponse,
  getLaboratoryMockResponse,
  setCourseMockResponse,
  getCourseGroupMockResponse,
  setCourseGroupResponse,
  deleteGroupMockResponse,
  deleteLaboratoryMockResponse,
  patchCourseGroupStudentMockResponse,
  setCourseLabMockResponse,
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
import { Submission } from '../../interfaces/resource';
import { postSubmissionMockResponse } from '../mocks/in-memory-resource-mocks';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';

/**
 * /courses GET
 */
export async function getCourses(): Promise<GetCoursesResponse> {
  return getCoursesListMockResponse();
}

/**
 * /course/:id GET
 */
export async function getCourse(_id: string): Promise<GetCourseResponse> {
  return getCourseMockResponse(_id);
}

/**
 * /course/:id PUT
 */
export async function setCourse(course: Course): Promise<PostCourseResponse> {
  return setCourseMockResponse(course);
}

/**
 * /course/:id/group/:id2 GET
 */
export async function getCourseGroup(
  courseID: string, groupID: string,
): Promise<GetCourseGroupResponse> {
  return getCourseGroupMockResponse(courseID, groupID);
}

/**
 * /course/:id/group/:id2 PUT
 */
export async function setCourseGroup(
  id: string, group: CourseGroup,
): Promise<PostCourseGroupResponse> {
  return setCourseGroupResponse(id, group);
}

/**
 * /course/:id/group/:id2 DELETE
 */
export async function deleteCourseGroup(_id: string): Promise<ApiPostResponse> {
  return deleteGroupMockResponse(_id);
}

/**
 * /course/:id/laboratory/:id2 GET
 */
export async function getCourseLaboratory(
  courseID: string,
  labID: string,
): Promise<GetLaboratoryResponse> {
  return getLaboratoryMockResponse(courseID, labID);
}

/**
 * /course/:id/laboratory/:id2 PUT
 */
export async function putLaboratory(
  courseID: string,
  lab: CourseLaboratory,
): Promise<GetLaboratoryResponse> {
  const { error } = lab.validate();
  if (error) {
    console.error(error);
    return Promise.reject(error);
  }
  return setCourseLabMockResponse(courseID, lab);
}

/**
 * /course/:id/laboratory/:id2 DELETE
 */
export async function deleteCourseLaboratory(
  courseID: string,
  labID: string,
): Promise<ApiPostResponse> {
  return deleteLaboratoryMockResponse(courseID, labID);
}

/**
 * /course/:id/laboratory/:id2/submission POST
 */
export async function postSubmission(submission: Submission) {
  return postSubmissionMockResponse(submission);
}

/**
 * /course/:id/group/:id2/student/:id3 PATCH
 * @param courseID
 * @param groupID
 * @param studentID
 */
export async function patchCourseGroupStudent(
  courseID: string, groupID: string, studentID: string,
): Promise<PatchCourseGroupStudentResponse> {
  return patchCourseGroupStudentMockResponse(courseID, groupID, studentID);
}

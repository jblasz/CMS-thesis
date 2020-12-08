import { Course } from '../../interfaces/course';
import {
  getCoursesListMockResponse,
  getCourseMockResponse,
  getLaboratoryMockResponse,
  putCourseMockResponse,
  getCourseGroupMockResponse,
  setCourseGroupResponse,
  deleteGroupMockResponse,
  deleteLaboratoryMockResponse,
  patchCourseGroupStudentMockResponse,
  setCourseLabMockResponse,
  deleteCourseMockResponse,
} from '../mocks/in-memory-course-mocks';
import { CourseGroup } from '../../interfaces/courseGroup';
import {
  IGetCoursesResponse,
  IGetCourseResponse,
  IGetCourseGroupResponse,
  IPostCourseResponse,
  IPostCourseGroupResponse,
  IGetLaboratoryResponse,
  IApiPostResponse,
  IPatchCourseGroupStudentResponse,
  IPutCourseLaboratoryResponse,
} from '../../interfaces/api';
import { ISubmissionMeta, SubmissionGrade } from '../../interfaces/resource';
import { postSubmissionMockResponse } from '../mocks/in-memory-resource-mocks';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { axiosInstance } from './request.service';
import { config } from '../../config';

/**
 * /course GET
 */
export async function getCourses(): Promise<IGetCoursesResponse> {
  if (config.useMocks) {
    const { courses } = await getCoursesListMockResponse();
    return { courses: courses.map((x) => new Course(x)) };
  }
  console.log(axiosInstance);
  const { courses } = (await axiosInstance.get('/course')).data as IGetCoursesResponse;
  console.log(courses);
  return { courses: courses.map((x) => new Course(x)) };
}

/**
 * /course/:id GET
 */
export async function getCourse(_id: string): Promise<IGetCourseResponse> {
  if (config.useMocks) { return getCourseMockResponse(_id); }
  const { course } = (await axiosInstance.get(`/course/${_id}`)).data as IGetCourseResponse;
  return { course: new Course(course) };
}

/**
 * /course/:id PUT
 */
export async function putCourse(course: Course): Promise<IPostCourseResponse> {
  if (config.useMocks) { return putCourseMockResponse(course); }
  const { course: _course } = (await axiosInstance.post(`/course/${course._id}`, { course })).data as IPostCourseResponse;
  return { ok: true, course: new Course(_course) };
}

/**
 * /course/:id DELETE
 */
export async function deleteCourse(_id: string): Promise<IApiPostResponse> {
  if (config.useMocks) { return deleteCourseMockResponse(_id); }
  const { ok } = (await axiosInstance.delete(`/course/${_id}`)).data as IApiPostResponse;
  return { ok };
}

/**
 * /course/:id/group/:id2 GET
 */
export async function getCourseGroup(
  courseID: string, groupID: string,
): Promise<IGetCourseGroupResponse> {
  if (config.useMocks) { return getCourseGroupMockResponse(courseID, groupID); }
  const { courseId, courseName, group } = (await axiosInstance.get(`/course/${courseID}/group/${groupID}`)).data as IGetCourseGroupResponse;
  return { courseId, courseName, group: new CourseGroup(group) };
}

/**
 * /course/:id/group/:id2 PUT
 */
export async function setCourseGroup(
  id: string, group: CourseGroup,
): Promise<IPostCourseGroupResponse> {
  if (config.useMocks) { return setCourseGroupResponse(id, group); }
  const { ok, group: _group } = (await axiosInstance.put(`/course/${id}/group/${group._id}`, group)).data as IPostCourseGroupResponse;
  return { group: new CourseGroup(_group), ok };
}

/**
 * /course/:id/group/:id2 DELETE
 */
export async function deleteCourseGroup(
  courseId: string,
  groupId: string,
): Promise<IApiPostResponse> {
  if (config.useMocks) { return deleteGroupMockResponse(courseId); }
  const { ok } = (await axiosInstance.delete(`/course/${courseId}/group/${groupId}`)).data as IApiPostResponse;
  return { ok };
}

/**
 * /course/:id/laboratory/:id2 GET
 */
export async function getCourseLaboratory(
  courseID: string,
  labID: string,
): Promise<IGetLaboratoryResponse> {
  if (config.useMocks) { return getLaboratoryMockResponse(courseID, labID); }
  const {
    courseId,
    courseName,
    laboratory,
  } = (await axiosInstance.get(`/course/${courseID}/laboratory/${labID}`)).data as IGetLaboratoryResponse;

  return { courseId, courseName, laboratory: new CourseLaboratory(laboratory) };
}

/**
 * /course/:id/laboratory/:id2 PUT
 */
export async function putLaboratory(
  courseID: string,
  lab: CourseLaboratory,
): Promise<IPutCourseLaboratoryResponse> {
  const { error } = lab.validate();
  if (error) {
    console.error(error);
    return Promise.reject(error);
  }
  if (config.useMocks) { return setCourseLabMockResponse(courseID, lab); }
  const { ok, laboratory } = (await axiosInstance.put(`/course/${courseID}/laboratory/${lab._id}`, lab)).data as IPutCourseLaboratoryResponse;
  return { ok, laboratory: new CourseLaboratory(laboratory) };
}

/**
 * /course/:id/laboratory/:id2 DELETE
 */
export async function deleteCourseLaboratory(
  courseID: string,
  labID: string,
): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteLaboratoryMockResponse(courseID, labID);
  }
  const { ok } = (await axiosInstance.delete(`/course/${courseID}/laboratory/${labID}`)).data as IApiPostResponse;
  return { ok };
}

/**
 * /course/:id/laboratory/:id2/submission POST
 */
export async function postSubmission(submission: ISubmissionMeta): Promise<IApiPostResponse> {
  if (config.useMocks) { return postSubmissionMockResponse(submission); }
  const { ok } = (await axiosInstance.post(`/course/${submission.forCourseID}/laboratory/${submission.forLabID}/submission`, submission)).data as IApiPostResponse;
  return { ok };
}

/**
 * /course/:id/group/:id2/student/:id3 PATCH
 * @param courseID
 * @param groupID
 * @param studentID
 */
export async function patchCourseGroupStudent(
  courseID: string, groupID: string, studentID: string, grade?: SubmissionGrade | null,
): Promise<IPatchCourseGroupStudentResponse> {
  if (config.useMocks) {
    return patchCourseGroupStudentMockResponse(courseID, groupID, studentID);
  }
  const { group, ok } = (await axiosInstance.patch(`/course/${courseID}/group/${groupID}/student/${studentID}`, {
    ...(grade || grade === null ? { grade } : {}),
  })).data as IPatchCourseGroupStudentResponse;
  return { ok, group: new CourseGroup(group) };
}

/**
 * /course/:id/group/:id2/student/:id3 DELETE
 * @param courseID
 * @param groupID
 * @param studentID
 */
export async function deleteCourseGroupStudent(
  courseID: string, groupID: string, studentID: string,
): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return { ok: true };
  }
  const { ok } = (await axiosInstance.delete(`/course/${courseID}/group/${groupID}/student/${studentID}`)).data as IPatchCourseGroupStudentResponse;
  return { ok };
}

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
  IPutCourseLaboratoryTaskResponse,
} from '../../interfaces/api';
import { ISubmissionMeta, SubmissionGrade } from '../../interfaces/resource';
import { postSubmissionMockResponse } from '../mocks/in-memory-resource-mocks';
import { CourseLaboratory } from '../../interfaces/courseLaboratory';
import { axiosInstance } from './request.service';
import { config } from '../../config';
import { CourseTask } from '../../interfaces/courseTask';

/**
 * /public/course GET
 */
export async function getPublicCourses(): Promise<IGetCoursesResponse> {
  if (config.useMocks) {
    const { courses } = await getCoursesListMockResponse();
    return { courses: courses.map((x) => new Course(x)) };
  }
  const { courses } = (await axiosInstance.get('/public/course')).data as IGetCoursesResponse;
  return { courses: courses.map((x) => new Course(x)) };
}

/**
 * /course GET
 */
export async function getAdminCourses(): Promise<IGetCoursesResponse> {
  if (config.useMocks) {
    const { courses } = await getCoursesListMockResponse();
    return { courses: courses.map((x) => new Course(x)) };
  }
  const { courses } = (await axiosInstance.get('/course')).data as IGetCoursesResponse;
  return { courses: courses.map((x) => new Course(x)) };
}

/**
 * /public/course/:id GET
 */
export async function getPublicCourse(_id: string): Promise<IGetCourseResponse> {
  if (config.useMocks) { return getCourseMockResponse(_id); }
  const { course } = (await axiosInstance.get(`/public/course/${_id}`)).data as IGetCourseResponse;
  return { course: new Course(course) };
}

/**
 * /course/:id GET
 */
export async function getAdminCourse(_id: string): Promise<IGetCourseResponse> {
  if (config.useMocks) { return getCourseMockResponse(_id); }
  const { course } = (await axiosInstance.get(`/course/${_id}`)).data as IGetCourseResponse;
  return { course: new Course(course) };
}

/**
 * /course/:id PUT
 */
export async function putAdminCourse(course: Course): Promise<IPostCourseResponse> {
  if (config.useMocks) { return putCourseMockResponse(course); }
  const { course: _course } = (await axiosInstance.post(`/course/${course._id}`, { course })).data as IPostCourseResponse;
  return { ok: true, course: new Course(_course) };
}

/**
 * /course/:id DELETE
 */
export async function deleteAdminCourse(_id: string): Promise<IApiPostResponse> {
  if (config.useMocks) { return deleteCourseMockResponse(_id); }
  const { ok } = (await axiosInstance.delete(`/course/${_id}`)).data as IApiPostResponse;
  return { ok };
}

/**
 * /course/:id/group/:id2 GET
 */
export async function getAdminCourseGroup(
  courseID: string, groupID: string,
): Promise<IGetCourseGroupResponse> {
  if (config.useMocks) { return getCourseGroupMockResponse(courseID, groupID); }
  const { courseId, courseName, group } = (await axiosInstance.get(`/public/course/${courseID}/group/${groupID}`)).data as IGetCourseGroupResponse;
  return { courseId, courseName, group: new CourseGroup(group) };
}

/**
 * /course/:id/group/:id2 PUT
 */
export async function setAdminCourseGroup(
  id: string, group: CourseGroup,
): Promise<IPostCourseGroupResponse> {
  if (config.useMocks) { return setCourseGroupResponse(id, group); }
  const path = group._id === '' ? `/course/${id}/group` : `/course/${id}/group/${group._id}`;
  const
    { ok, group: _group } = (await axiosInstance.put(path, group)).data as IPostCourseGroupResponse;
  return { group: new CourseGroup(_group), ok };
}

/**
 * /course/:id/group/:id2 DELETE
 */
export async function deleteAdminCourseGroup(
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
export async function getPublicCourseLaboratory(
  courseID: string,
  labID: string,
): Promise<IGetLaboratoryResponse> {
  if (config.useMocks) { return getLaboratoryMockResponse(courseID, labID); }
  const {
    courseId,
    courseName,
    laboratory,
  } = (await axiosInstance.get(`/public/course/${courseID}/laboratory/${labID}`)).data as IGetLaboratoryResponse;

  return { courseId, courseName, laboratory: new CourseLaboratory(laboratory) };
}

/**
 * /course/:id/laboratory/:id2 GET
 */
export async function getAdminCourseLaboratory(
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
export async function putAdminLaboratory(
  courseID: string,
  lab: CourseLaboratory,
): Promise<IPutCourseLaboratoryResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tasks: _tasks, ...toSend } = lab;
  if (config.useMocks) {
    return setCourseLabMockResponse(courseID, new CourseLaboratory({ ...toSend, tasks: {} }));
  }
  const path = lab._id === '' ? `/course/${courseID}/laboratory` : `/course/${courseID}/laboratory/${lab._id}`;
  const
    { ok, laboratory } = (
      await axiosInstance.put(path, toSend)
    ).data as IPutCourseLaboratoryResponse;
  return { ok, laboratory: new CourseLaboratory(laboratory) };
}

/**
 * /course/:id/laboratory/:id2/task/:groupid PUT
 */
export async function putAdminCourseLaboratoryTask(
  courseID: string, labID: string, groupID: string, task: CourseTask,
): Promise<IPutCourseLaboratoryTaskResponse> {
  if (config.useMocks) {
    return { ok: true, task: new CourseTask(task) };
  }
  const { ok, task: _task } = (
    (await axiosInstance.put(`/course/${courseID}/laboratory/${labID}/task/${groupID}`, { task })).data as IPutCourseLaboratoryTaskResponse
  );
  return { ok, task: new CourseTask(_task) };
}

/**
 * /course/:id/laboratory/:id2 DELETE
 */
export async function deleteAdminCourseLaboratory(
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
    return patchCourseGroupStudentMockResponse(courseID, groupID);
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

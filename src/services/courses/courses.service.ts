import { Course, ICourse } from '../../interfaces/course';
import {
  getCoursesListMockResponse,
  getCourseMockResponse,
  putCourseMockResponse,
  getLaboratoryMockResponse,
  setCourseMockResponse,
} from '../mocks/in-memory-course-mocks';
import { ICourseLaboratory } from '../../interfaces/courseLaboratory';

export async function getCourses(): Promise<{ courses: ICourse[] }> {
  return getCoursesListMockResponse();
}

export async function getCourse(_id: string): Promise<ICourse> {
  return getCourseMockResponse(_id);
}

export async function setCourse(course: Course): Promise<{ok: boolean, course: ICourse}> {
  return setCourseMockResponse(course);
}

export async function putCourse(course: Course): Promise<{ status: string }> {
  return putCourseMockResponse(course);
}

export async function getLaboratory(_id: string): Promise<ICourseLaboratory> {
  return getLaboratoryMockResponse(_id);
}

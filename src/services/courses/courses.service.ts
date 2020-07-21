import { Course, ICourse } from '../../interfaces/course';
import { getCoursesListMockResponse, getCourseMockResponse, putCourseMockResponse } from '../mocks/in-memory-course-mocks';

export async function getCourses(): Promise<{ courses: ICourse[] }> {
  return getCoursesListMockResponse();
}

export async function getCourse(_id: string): Promise<ICourse> {
  return getCourseMockResponse(_id);
}

export async function putCourse(course: Course): Promise<{ status: string }> {
  return putCourseMockResponse(course);
}

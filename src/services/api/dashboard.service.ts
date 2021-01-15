import { config } from '../../config';
import {
  IGetAdminDashboardResponse,
  IGetDashboardLaboratoriesResponse,
  IGetStudentCourseResponse,
  IGetStudentCoursesResponse,
  IGetStudentDashboardResponse,
} from '../../interfaces/api';
import { PendingLaboratory } from '../../interfaces/misc';
import { StudentCourse } from '../../interfaces/studentCourse';
import {
  getStudentCourseMockResponse,
  getStudentCoursesMockResponse,
  getStudentDashboardMockResponse,
} from '../mocks';
import { getDashboardLaboratoriesMockResponse } from '../mocks/in-memory-course-mocks';
import { getAdminDashboardMockResponse } from '../mocks/in-memory-submissions-mocks';
import { axiosInstance } from './request.service';

/**
 * /dashboard/laboratory GET
 */
export async function getDashboardLaboratories(
  studentID: string,
): Promise<IGetDashboardLaboratoriesResponse> {
  if (config.useMocks) {
    const { laboratories } = await getDashboardLaboratoriesMockResponse(studentID);
    return { laboratories: laboratories.map((x) => PendingLaboratory(x)) };
  }
  const { data } = await axiosInstance.get('/dashboard/laboratory');
  const { laboratories } = data as IGetDashboardLaboratoriesResponse;
  return { laboratories: laboratories.map((x) => PendingLaboratory(x)) };
}

/**
 * /dashboard/summary GET
 */
export async function getAdminDashboard(): Promise<IGetAdminDashboardResponse> {
  if (config.useMocks) {
    return getAdminDashboardMockResponse();
  }
  const { data } = await axiosInstance.get('/dashboard/summary');
  const { unmarkedSolutionsCount } = data as IGetAdminDashboardResponse;
  return { unmarkedSolutionsCount };
}

/**
 * /dashboard/studentSummary
 */
export async function getStudentDashboard(): Promise<IGetStudentDashboardResponse> {
  if (config.useMocks) {
    return Promise.resolve(getStudentDashboardMockResponse());
  }
  const { data } = await axiosInstance.get('/dashboard/studentSummary');
  const { upcoming } = data as IGetStudentDashboardResponse;
  return { upcoming };
}

/**
 * /student/courses GET
 */
export async function getStudentCourses(): Promise<IGetStudentCoursesResponse> {
  if (config.useMocks) {
    const { courses } = await getStudentCoursesMockResponse();
    return { courses };
  }
  const { data } = await axiosInstance.get('/student/courses');
  const { courses } = data as IGetStudentCoursesResponse;
  return { courses };
}

/**
 * /student/courses/:id GET
 */
export async function getStudentCourse(id: string): Promise<IGetStudentCourseResponse> {
  if (config.useMocks) {
    return getStudentCourseMockResponse(id);
  }
  const { data } = await axiosInstance.get(`/student/courses/${id}`);
  const { course } = data as IGetStudentCourseResponse;
  return { course: StudentCourse(course) };
}

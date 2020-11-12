import {
  GetAdminDashboardResponse,
  GetDashboardLaboratoriesResponse,
  GetStudentCourseResponse,
  GetStudentCoursesResponse,
  GetStudentDashboardResponse,
} from '../../interfaces/api';
import {
  getAdminDashboardMockResponse,
  getStudentCourseMockResponse,
  getStudentCoursesMockResponse,
  getStudentDashboardMockResponse,
} from '../mocks';
import { getDashboardLaboratoriesMockResponse } from '../mocks/in-memory-course-mocks';

/**
 * /dashboard/laboratory GET
 */
export async function getDashboardLaboratories(
  timespan: number,
): Promise<GetDashboardLaboratoriesResponse> {
  const res = await getDashboardLaboratoriesMockResponse(timespan);
  res.laboratories.forEach((x) => {
    x.startsAt = new Date(x.startsAt);
    x.endsAt = new Date(x.endsAt);
  });
  return res;
}

/**
 * /dashboard/summary GET
 */
export async function getAdminDashboard(): Promise<GetAdminDashboardResponse> {
  return getAdminDashboardMockResponse();
}

/**
 * /dashboard/studentSummary
 */
export async function getStudentDashboard(): Promise<GetStudentDashboardResponse> {
  return getStudentDashboardMockResponse();
}

/**
 * /student/courses GET
 */
export async function getStudentCourses(): Promise<GetStudentCoursesResponse> {
  const { courses } = await getStudentCoursesMockResponse();
  return { courses };
}

/**
 * /student/courses/:id GET
 */
export async function getStudentCourse(id: string): Promise<GetStudentCourseResponse> {
  return getStudentCourseMockResponse(id);
}

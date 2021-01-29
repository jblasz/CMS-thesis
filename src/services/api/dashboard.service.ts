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
  getLandingPageMockResponse,
  getStudentCourseMockResponse,
  getStudentCoursesMockResponse,
  getStudentDashboardMockResponse,
  putLandingPageMockResponse,
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
  const { data } = await axiosInstance.get('/dashboard/laboratory', {
    params: {
      time: 7,
    },
  });
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
export async function getStudentDashboard(
  studentID: string,
): Promise<IGetStudentDashboardResponse> {
  if (config.useMocks) {
    return Promise.resolve(getStudentDashboardMockResponse(studentID));
  }
  const { data } = await axiosInstance.get('/dashboard/studentSummary');
  const { upcoming } = data as IGetStudentDashboardResponse;
  return { upcoming };
}

/**
 * /student/courses GET
 */
export async function getStudentCourses(studentID: string): Promise<IGetStudentCoursesResponse> {
  if (config.useMocks) {
    const { courses } = await getStudentCoursesMockResponse(studentID);
    return { courses };
  }
  const { data } = await axiosInstance.get('/student/courses');
  const { courses } = data as IGetStudentCoursesResponse;
  return { courses };
}

/**
 * /student/courses/:id GET
 */
export async function getStudentCourse(
  studentID: string, courseID: string,
): Promise<IGetStudentCourseResponse> {
  if (config.useMocks) {
    return getStudentCourseMockResponse(studentID, courseID);
  }
  const { data } = await axiosInstance.get(`/student/courses/${courseID}`);
  const { course } = data as IGetStudentCourseResponse;
  return { course: StudentCourse(course) };
}

/**
 * /landingPage GET
 */
export async function getLandingPage() {
  if (config.useMocks) {
    return getLandingPageMockResponse();
  }
  const { data } = await axiosInstance.get('/public/landingPage');
  return { landingPage: data.landingPage || '' };
}

/**
 * /admin/landingPage PUT
 */
export async function putLandingPage(v: string) {
  if (config.useMocks) {
    return putLandingPageMockResponse(v);
  }
  const { data } = await axiosInstance.put('/landingPage', { landingPage: v });
  return { landingPage: data.landingPage || '' };
}

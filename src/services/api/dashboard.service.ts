import {
  IGetAdminDashboardResponse,
  IGetDashboardLaboratoriesResponse,
  IGetStudentCourseResponse,
  IGetStudentCoursesResponse,
  IGetStudentDashboardResponse,
} from '../../interfaces/api';
import { CourseLabGroupMetaWithDates, NormalizeCourseGroupMetaWithGrade, PendingLaboratory } from '../../interfaces/misc';
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
import { appEnv } from '../../appEnv';

/**
 * /dashboard/laboratory GET
 */
export async function getDashboardLaboratories(
  studentID: string,
): Promise<IGetDashboardLaboratoriesResponse> {
  if (appEnv().useMocks) {
    const { laboratories } = await getDashboardLaboratoriesMockResponse(studentID);
    return { laboratories: laboratories.map((x) => PendingLaboratory(x)) };
  }
  const { data } = await axiosInstance.get('/dashboard/laboratory', {
    params: {
      time: 31,
    },
  });
  const { laboratories } = data as IGetDashboardLaboratoriesResponse;
  return { laboratories: laboratories.map((x) => PendingLaboratory(x)) };
}

/**
 * /dashboard/summary GET
 */
export async function getAdminDashboard(): Promise<IGetAdminDashboardResponse> {
  if (appEnv().useMocks) {
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
  if (appEnv().useMocks) {
    return Promise.resolve(getStudentDashboardMockResponse(studentID));
  }
  const { data } = await axiosInstance.get('/dashboard/studentSummary');
  const { upcoming } = data as IGetStudentDashboardResponse;
  return { upcoming: upcoming.map((x) => CourseLabGroupMetaWithDates(x)) };
}

/**
 * /student/courses GET
 */
export async function getStudentCourses(studentID: string): Promise<IGetStudentCoursesResponse> {
  if (appEnv().useMocks) {
    const { courses } = await getStudentCoursesMockResponse(studentID);
    return { courses };
  }
  const { data } = await axiosInstance.get('/student/courses');
  const { courses } = data as IGetStudentCoursesResponse;
  return { courses: courses.map((x) => NormalizeCourseGroupMetaWithGrade(x)) };
}

/**
 * /student/courses/:id GET
 */
export async function getStudentCourse(
  studentID: string, courseID: string,
): Promise<IGetStudentCourseResponse> {
  if (appEnv().useMocks) {
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
  if (appEnv().useMocks) {
    return getLandingPageMockResponse();
  }
  const { data } = await axiosInstance.get('/public/landingPage');
  return { landingPage: (data && data.landingPage) || '' };
}

/**
 * /admin/landingPage PUT
 */
export async function putLandingPage(v: string) {
  if (appEnv().useMocks) {
    return putLandingPageMockResponse(v);
  }
  const { data } = await axiosInstance.put('/landingPage', { landingPage: v });
  return { landingPage: (data && data.landingPage) || '' };
}

import { loremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import {
  IGetAdminDashboardResponse,
  IGetResourcesResponse,
  IGetStudentCourseResponse,
  IGetStudentCoursesResponse,
  IGetStudentDashboardResponse,
} from '../../interfaces/api';
import { CourseLanguage } from '../../interfaces/course';
import { SubmissionGrade } from '../../interfaces/resource';
import { StudentCourse } from '../../interfaces/studentCourse';
import { generateList } from '../../utils';
import { generateCourseMock, getCoursesListMockResponse, getLabsReferencingResourceId } from './in-memory-course-mocks';
import { generateResourceMocks, getResourceMocks } from './in-memory-resource-mocks';
import { generateStudentMocks, getStudentsMockResponse } from './in-memory-student-mocks';
import { generateSubmissionMock } from './in-memory-submissions-mocks';

export async function populateInMemoryDBWithSomeMocks(count = 5) {
  generateStudentMocks(100);
  generateResourceMocks(10);
  generateCourseMock('staticCourseID');
  generateList(count).forEach(() => generateCourseMock());
  const { students } = await getStudentsMockResponse();
  const tasks = (await getCoursesListMockResponse())
    .courses
    .map((x) => Object.values(x.laboratories[0].tasks)[0]);
  generateList(20).forEach(() => generateSubmissionMock(
    tasks[Math.floor(Math.random() * tasks.length)],
    students[Math.floor(Math.random() * students.length)],
  ));
  console.log('generated some mocks for in-memory');
}

export async function getResourcesMockResponse(): Promise<IGetResourcesResponse> {
  return Promise.resolve(
    {
      resources: ((await getResourceMocks())).map((x) => ({
        _id: x._id,
        name: x.name,
        usedBy: getLabsReferencingResourceId(x._id),
        permission: x.permission,
      })),
    },
  );
}

export async function getAdminDashboardMockResponse(): Promise<IGetAdminDashboardResponse> {
  return Promise.resolve({
    unmarkedSolutionsCount: 3,
  });
}

export async function getStudentDashboardMockResponse(): Promise<IGetStudentDashboardResponse> {
  return Promise.resolve({
    upcoming: [
      {
        active: true,
        courseId: v4(),
        courseName: 'course name 1',
        groupId: v4(),
        groupName: 'group name',
        labId: v4(),
        labName: 'lab name',
        endsAt: new Date(new Date().valueOf() + 60 * 60 * 1000),
        startsAt: new Date(),
      },
      {
        active: true,
        courseId: v4(),
        courseName: 'course name 2',
        groupId: v4(),
        groupName: 'group name 2',
        labId: v4(),
        labName: 'lab name 3',
        endsAt: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
        startsAt: new Date(new Date().valueOf() + 23 * 60 * 60 * 1000),
      },
    ],
  });
}

export async function getStudentCoursesMockResponse(): Promise<IGetStudentCoursesResponse> {
  return Promise.resolve({
    courses: [
      {
        active: false,
        courseId: v4(),
        courseName: 'course name 1',
        groupId: v4(),
        groupName: 'group name',
        grade: SubmissionGrade.A,
      },
      {
        active: false,
        courseId: v4(),
        courseName: 'course name 2',
        groupId: v4(),
        groupName: 'group name 2',
        labId: v4(),
        labName: 'lab name 3',
        grade: SubmissionGrade.F,
      },
    ],
  });
}

export async function getStudentCourseMockResponse(id: string): Promise<IGetStudentCourseResponse> {
  return Promise.resolve({
    course: StudentCourse({
      _id: id,
      active: true,
      description: loremIpsum(),
      groupId: v4(),
      groupName: 'group name',
      laboratories: [{
        _id: v4(),
        name: 'name1',
        dateFrom: new Date(),
        dateTo: new Date(new Date().valueOf() + 60 * 60 * 1000),
      },
      {
        _id: v4(),
        name: 'name2',
        dateFrom: new Date(new Date().valueOf() + 60 * 60 * 1000),
      }],
      language: CourseLanguage.EN,
      name: 'course name',
      semester: '2020Z',
      grade: SubmissionGrade.B_PLUS,
    }),
  });
}

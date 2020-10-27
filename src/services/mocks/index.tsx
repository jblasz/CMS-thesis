import { GetAdminDashboardResponse, GetResourcesResponse } from '../../interfaces/api';
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
  generateList(5).forEach(() => generateSubmissionMock(
    tasks[Math.floor(Math.random() * tasks.length)],
    students[Math.floor(Math.random() * students.length)],
  ));
  console.log('generated some mocks for in-memory');
}

export async function getResourcesMockResponse(): Promise<GetResourcesResponse> {
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

export async function getAdminDashboardMockResponse(): Promise<GetAdminDashboardResponse> {
  return Promise.resolve({
    unmarkedSolutionsCount: 3,
  });
}

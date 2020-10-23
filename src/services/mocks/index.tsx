import { GetResourcesResponse } from '../../interfaces/api';
import { generateList } from '../../utils';
import { generateCourseMock, getLabsReferencingResourceId } from './in-memory-course-mocks';
import { generateResourceMocks, getResourceMocks } from './in-memory-resource-mocks';
import { generateStudentMocks } from './in-memory-student-mocks';

export function populateInMemoryDBWithSomeMocks(count = 5) {
  generateStudentMocks(100);
  generateResourceMocks(10);
  generateCourseMock('staticCourseID');
  generateList(count).forEach(() => generateCourseMock());
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

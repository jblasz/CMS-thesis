import { generateList } from '../../utils';
import { generateCourseMock } from './in-memory-course-mocks';
import { generateStudentMocks } from './in-memory-student-mocks';

export function populateInMemoryDBWithSomeMocks(count = 5) {
  generateStudentMocks(100);
  generateCourseMock('staticCourseID');
  generateList(count).forEach(() => generateCourseMock());
  console.log('generated some mocks for in-memory');
}

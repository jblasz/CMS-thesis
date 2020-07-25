import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { Course } from '../../interfaces/course';

const inMemoryCourseMocks: Course[] = [];

let generatorCount = 0;

export function generateCourseMock(): Course {
  return new Course({
    _id: v4(),
    name: `random_name_${generatorCount++}`,
    description: loremIpsum(),
    language: Math.random() > 0.5 ? 'en' : 'pl',
  });
}

export async function getCoursesListMockResponse() {
  return Promise.resolve({ courses: inMemoryCourseMocks.map((x) => new Course(x)) });
}

export async function putCourseMockResponse(course: Course) {
  inMemoryCourseMocks.push(course);
  return Promise.resolve({ status: 'ok' });
}

export async function getCourseMockResponse(_id: string) {
  const f = inMemoryCourseMocks.find((x) => x._id === _id);
  if (f) {
    return Promise.resolve(new Course(f));
  }
  return Promise.reject();
}

export function populateInMemoryDBWithSomeMocks(count = 5) {
  for (let i = 0; i < count; i++) {
    inMemoryCourseMocks.push(generateCourseMock());
  }
  console.log('generated some mocks for in-memory:', inMemoryCourseMocks.length);
}

import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseGroup } from '../../interfaces/courseGroup';
import { Student } from '../../interfaces/student';
import { CourseTask } from '../../interfaces/courseTask';

const inMemoryCourseMocks: Course[] = [];

let generatorCount = 0;

function generateList(count: number, stackAdditionalRandom = 0) {
  const len = count + Math.floor(Math.random() * stackAdditionalRandom);
  const ret = [];
  for (let i = 0; i < len; i++) {
    ret.push(i);
  }
  return ret;
}

export function generateCourseMock(): Course {
  const groups = generateList(2, 2).map(() => generateCourseGroupMock());
  return new Course({
    _id: v4(),
    name: `Course Name Mk ${generatorCount++}`,
    description: loremIpsum(),
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 5).map(() => generateLaboratoryMock(groups)),
    links: [],
  });
}

export function generateCourseGroupMock(): CourseGroup {
  return new CourseGroup({
    _id: v4(),
    students: generateList(10, 5).map((n) => new Student({
      _id: v4(),
      email: `mail_${n}@domain.com`,
      name: `student Mk ${n}`,
      usosId: '123321',
    })),
  });
}

export function generateLaboratoryMock(groups?: CourseGroup[]): CourseLaboratory {
  return new CourseLaboratory({
    _id: v4(),
    description: loremIpsum(),
    tasks: groups
      ? groups.reduce(
        (agg: TaskToGroupMapping, group) => ({ ...agg, [group._id]: generateCourseTaskMock() }), {},
      )
      : {},
  });
}

export function generateCourseTaskMock():CourseTask {
  return {
    _id: v4(),
    description: loremIpsum(),
    gracePeriod: Math.random() > 0.5 ? Math.round(Math.random() * 1000 * 60 * 15) : 0,
  };
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
  inMemoryCourseMocks.push(...generateList(count).map(() => generateCourseMock()));
  console.log('generated some mocks for in-memory:', inMemoryCourseMocks);
}

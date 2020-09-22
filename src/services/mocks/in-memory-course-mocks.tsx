import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseGroup } from '../../interfaces/courseGroup';
import { Student } from '../../interfaces/student';
import { CourseTask } from '../../interfaces/courseTask';
import {
  GetCourseGroupResponse,
  GetCourseResponse,
  GetLaboratoryResponse,
  PostCourseGroupResponse,
  PostCourseResponse,
} from '../../interfaces/api';

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

export function generateCourseMock(id = v4()): Course {
  const groups = generateList(2, 2).map(() => generateCourseGroupMock());
  labCount = 1;
  return new Course({
    _id: id,
    name: `Course Name Mk ${generatorCount++}`,
    description: loremIpsum(),
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 5).map(() => generateLaboratoryMock(groups)),
    links: [],
  });
}

let studentCount = 1;

export function generateCourseGroupMock(): CourseGroup {
  return new CourseGroup({
    _id: v4(),
    name: loremIpsum().split(' ')[0],
    students: generateList(10, 5).map(() => {
      const n = studentCount++;
      return new Student({
        _id: v4(),
        email: `mail_${n}@domain.com`,
        name: `student Mk ${n}`,
        usosId: '123321',
      });
    }),
  });
}

let labCount = 1;

export function generateLaboratoryMock(groups?: CourseGroup[]): CourseLaboratory {
  const rootDate = new Date(
    2020,
    labCount,
    Math.ceil(Math.random() * 14),
    10,
  );
  return new CourseLaboratory({
    _id: v4(),
    nameShort: (labCount++).toString(),
    name: loremIpsum().split(' ').slice(0, 3).join(' '),
    description: loremIpsum(),
    tasks: groups
      ? groups.reduce(
        (agg: TaskToGroupMapping, group) => ({
          ...agg,
          [group._id]: generateCourseTaskMock(rootDate, 90 * 60 * 1000),
        }), {},
      )
      : {},
  });
}

export function generateCourseTaskMock(dateFrom?: Date, duration?: number):CourseTask {
  const date = dateFrom
    && new Date(
      dateFrom.getUTCFullYear(),
      dateFrom.getUTCMonth(),
      dateFrom.getUTCDay() + (Math.random() > 0.8 ? 1 : 0),
      dateFrom.getUTCHours() + (Math.round(Math.random() * 8)),
    );
  // offset the time of each task starting a bit
  return new CourseTask({
    _id: v4(),
    description: loremIpsum(),
    gracePeriod: Math.random() > 0.5 ? Math.round(Math.random() * 1000 * 60 * 15) : 0,
    ...(date && duration
      ? {
        dateFrom: new Date(date),
        dateTo: new Date(date.valueOf() + duration),
      }
      : {}),
  });
}

export async function getCoursesListMockResponse() {
  return Promise.resolve({ courses: inMemoryCourseMocks.map((x) => new Course(x)) });
}

export async function putCourseMockResponse(course: Course) {
  inMemoryCourseMocks.push(course);
  return Promise.resolve({ status: 'ok' });
}

export async function getCourseMockResponse(_id: string): Promise<GetCourseResponse> {
  const f = inMemoryCourseMocks.find((x) => x._id === _id);
  if (f) {
    return Promise.resolve({ course: new Course(f) });
  }
  return Promise.reject();
}

export async function getCourseGroupMockResponse(_id: string): Promise<GetCourseGroupResponse> {
  for (const course of inMemoryCourseMocks) {
    const f = course.groups.find((group) => group._id === _id);
    if (f) {
      return Promise.resolve({ group: new CourseGroup(f) });
    }
  }
  return Promise.reject();
}

export async function setCourseMockResponse(course: Course): Promise<PostCourseResponse> {
  const f = inMemoryCourseMocks.findIndex((x) => x._id === course._id);
  if (f !== -1) {
    inMemoryCourseMocks[f] = course;
  } else {
    inMemoryCourseMocks.push(course);
  }
  return Promise.resolve({ ok: true, course: (await getCourseMockResponse(course._id)).course });
}

export async function setCourseGroupResponse(group: CourseGroup): Promise<PostCourseGroupResponse> {
  for (const course of inMemoryCourseMocks) {
    const f = course.groups.findIndex((x) => x._id === group._id);
    if (f > -1) {
      course.groups[f] = group;
      return Promise.resolve(
        // eslint-disable-next-line no-await-in-loop
        { ok: true, group: (await getCourseGroupMockResponse(group._id)).group },
      );
    }
  }
  return Promise.reject();
}

export function populateInMemoryDBWithSomeMocks(count = 5) {
  inMemoryCourseMocks.push(generateCourseMock('staticCourseID'), ...generateList(count).map(() => generateCourseMock()));
  console.log('generated some mocks for in-memory:', inMemoryCourseMocks);
}

export async function getLaboratoryMockResponse(_id: string): Promise<GetLaboratoryResponse> {
  let found = null;
  for (const course of inMemoryCourseMocks) {
    const f = course.laboratories.find((x) => x._id === _id);
    if (f) {
      found = f;
      break;
    }
  }

  if (found) {
    return Promise.resolve({ laboratory: new CourseLaboratory(found) });
  }
  return Promise.reject();
}

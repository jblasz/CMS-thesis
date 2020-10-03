import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseGroup } from '../../interfaces/courseGroup';
import { CourseTask } from '../../interfaces/courseTask';
import {
  ApiPostResponse,
  GetCourseGroupResponse,
  GetCourseResponse,
  GetLaboratoryResponse,
  PatchCourseGroupStudentResponse,
  PostCourseGroupResponse,
  PostCourseResponse,
  PutCourseLaboratoryResponse,
} from '../../interfaces/api';
import { getRandomStudents, getStudentMockResponse } from './in-memory-student-mocks';
import { generateList } from '../../utils';

const inMemoryCourseMocks: Course[] = [];

let generatorCount = 0;

export function generateCourseMock(id = v4()) {
  const groups = generateList(2, 2).map(() => generateCourseGroupMock());
  if (id === 'staticCourseID') {
    groups.unshift(generateCourseGroupMock('staticGroupID'));
  }
  labCount = 1;
  const topush = new Course({
    _id: id,
    name: `Course Name Mk ${generatorCount++}`,
    description: loremIpsum(),
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 5).map(() => generateLaboratoryMock(groups)),
    links: [],
  });
  if (id === 'staticCourseID') {
    topush.laboratories[0]._id = 'staticLabID';
  }
  inMemoryCourseMocks.push(topush);
}

export function generateCourseGroupMock(id = v4()): CourseGroup {
  return new CourseGroup({
    _id: id,
    name: loremIpsum().split(' ')[0],
    students: getRandomStudents(10 + Math.ceil(Math.random() * 5)),
  });
}

let labCount = 1;

export function generateLaboratoryMock(groups: CourseGroup[] = [], id = v4()): CourseLaboratory {
  const rootDate = new Date(
    2020,
    labCount,
    Math.ceil(Math.random() * 14),
    10,
  );
  const tasks = (groups && groups.reduce(
    (agg: TaskToGroupMapping, group) => ({
      ...agg,
      [group._id]: generateCourseTaskMock(rootDate, 90 * 60 * 1000),
    }),
    {},
  )) || {};
  if (groups && groups.find((x) => x._id === 'staticGroupID')) {
    tasks.staticGroupID._id = 'staticLabGroupID';
  }
  return new CourseLaboratory({
    _id: id,
    nameShort: (labCount++).toString(),
    name: loremIpsum().split(' ').slice(0, 3).join(' '),
    description: loremIpsum(),
    tasks,
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

export async function getCourseMockResponse(_id: string): Promise<GetCourseResponse> {
  const f = inMemoryCourseMocks.find((x) => x._id === _id);
  if (f) {
    return Promise.resolve({ course: new Course(f) });
  }
  return Promise.reject();
}

export async function getCourseGroupMockResponse(
  courseID: string, groupID: string,
): Promise<GetCourseGroupResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  if (group) {
    return Promise.resolve({ group: new CourseGroup(group) });
  }
  return Promise.reject();
}

export async function setCourseMockResponse(course: Course): Promise<PostCourseResponse> {
  course.groups.forEach((group) => {
    if (!group._id) {
      group._id = v4();
    }
  });
  course.laboratories.forEach((laboratory) => {
    if (!laboratory._id) {
      laboratory._id = v4();
    }
  });
  if (course._id) {
    const f = inMemoryCourseMocks.findIndex((x) => x._id === course._id);
    if (f > -1) {
      inMemoryCourseMocks[f] = course;
      return Promise.resolve(
        {
          ok: true,
          course: (await getCourseMockResponse(course._id)).course,
        },
      );
    }
    return Promise.reject();
  }
  inMemoryCourseMocks.push({
    ...course,
    _id: v4(),
  });

  return Promise.resolve({ ok: true, course: (await getCourseMockResponse(course._id)).course });
}

export async function setCourseGroupResponse(
  courseID: string,
  group: CourseGroup,
): Promise<PostCourseGroupResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject();
  }
  if (group._id) {
    const toReplace = course.groups.findIndex((x) => x._id === group._id);
    if (toReplace > -1) {
      course.groups[toReplace] = group;
      return Promise.resolve(
        // eslint-disable-next-line no-await-in-loop
        { ok: true, group: (await getCourseGroupMockResponse(course._id, group._id)).group },
      );
    }
  } else {
    course.groups.push({
      ...group,
      _id: v4(),
    });
    return Promise.resolve(
      // eslint-disable-next-line no-await-in-loop
      { ok: true, group: (await getCourseGroupMockResponse(course._id, group._id)).group },
    );
  }
  return Promise.reject();
}

export async function getLaboratoryMockResponse(
  courseID: string,
  labID: string,
): Promise<GetLaboratoryResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const lab = course && course.laboratories.find((x) => x._id === labID);

  if (course && lab) {
    course.groups.forEach((group) => {
      if (!Object.keys(lab.tasks).includes(group._id)) {
        lab.tasks[group._id] = new CourseTask();
      }
    });
    return Promise.resolve({ laboratory: new CourseLaboratory(lab) });
  }
  return Promise.reject();
}

export async function setCourseLabMockResponse(
  courseID: string,
  lab: CourseLaboratory,
): Promise<PutCourseLaboratoryResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject();
  }
  if (lab._id) {
    const toReplace = course.laboratories.findIndex((x) => x._id === lab._id);
    if (toReplace > -1) {
      course.laboratories[toReplace] = lab;
      return Promise.resolve(
        // eslint-disable-next-line no-await-in-loop
        {
          ok: true,
          laboratory: (await getLaboratoryMockResponse(course._id, lab._id)).laboratory,
        },
      );
    }
  } else {
    const topush = {
      ...lab,
      _id: v4(),
    };
    course.laboratories.push(topush);
    return Promise.resolve(
      // eslint-disable-next-line no-await-in-loop
      {
        ok: true,
        laboratory: (await getLaboratoryMockResponse(course._id, topush._id)).laboratory,
      },
    );
  }
  return Promise.reject();
}

export async function patchCourseGroupStudentMockResponse(
  courseID: string,
  groupID: string,
  studentID: string,
): Promise<PatchCourseGroupStudentResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  const { student } = await getStudentMockResponse(studentID);
  if (course && group && student) {
    if (!group.students.find((x) => x._id === student._id)) {
      group.students.push(student);
    }
    return Promise.resolve({ ok: true, group });
  }
  return Promise.reject();
}

export async function deleteGroupMockResponse(_id: string): Promise<ApiPostResponse> {
  let found = false;
  for (const course of inMemoryCourseMocks) {
    const f = course.groups.findIndex((x) => x._id === _id);
    if (f > -1) {
      found = true;
      course.groups.splice(f, 1);
      break;
    }
  }
  if (found) {
    return Promise.resolve({ ok: true });
  }
  return Promise.reject();
}

export async function deleteLaboratoryMockResponse(
  courseID: string,
  labID: string,
): Promise<ApiPostResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject(new Error('No course of this id'));
  }
  const f = course.laboratories.findIndex((x) => x._id === labID);
  if (f > -1) {
    course.laboratories.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('No lab of this id'));
}

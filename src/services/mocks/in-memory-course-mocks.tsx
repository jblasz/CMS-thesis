import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseGroup } from '../../interfaces/courseGroup';
import { CourseTask } from '../../interfaces/courseTask';
import {
  IApiPostResponse,
  IGetCourseGroupResponse,
  IGetCourseResponse,
  IGetDashboardLaboratoriesResponse,
  IGetLaboratoryResponse,
  IPatchCourseGroupStudentResponse,
  IPostCourseGroupResponse,
  IPostCourseResponse,
  IPutCourseLaboratoryResponse,
} from '../../interfaces/api';
import { getRandomStudents, getStudentMockResponse } from './in-memory-student-mocks';
import { generateList } from '../../utils';
import { grabRandomResource } from './in-memory-resource-mocks';
import { IUsedBy } from '../../interfaces/resource';

const inMemoryCourseMocks: Course[] = [];

let generatorCount = 0;

export function getLabsReferencingResourceId(id: string): IUsedBy[] {
  const matches: IUsedBy[] = [];
  for (const course of inMemoryCourseMocks) {
    for (const lab of course.laboratories) {
      const groupId = Object.keys(lab.tasks).find((gid) => lab.tasks[gid].resourceId === id);
      if (groupId) {
        matches.push({
          courseId: course._id, courseName: course.name, labId: lab._id, labName: lab.name, groupId,
        });
      }
    }
  }
  return matches;
}

let labCount = 0;

export function generateCourseMock(id = v4()) {
  const groups = generateList(2, 2).map(() => generateCourseGroupMock());
  if (id === 'staticCourseID') {
    groups.unshift(generateCourseGroupMock('staticGroupID'));
  }
  labCount = 0;
  const topush = new Course({
    _id: id,
    name: `Course Name Mk${generatorCount++}`,
    description: `<span style="color: rgb(26,188,156);"><em>inline styling</em></span> ${loremIpsum()}`,
    descriptionShort: `<span style="color: rgb(255,0,0);"><em>inline styling</em></span> ${loremIpsum()}`,
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 5).map(() => generateLaboratoryMock(groups)),
    links: [],
    active: Math.random() > 0.5,
    shown: true,
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
    students: getRandomStudents(10 + Math.ceil(Math.random() * 5)).map((s) => ({ ...s })),
  });
}

export function generateLaboratoryMock(groups: CourseGroup[] = [], id = v4()): CourseLaboratory {
  const rootDate = new Date();
  rootDate.setDate(rootDate.getDate() + Math.ceil((Math.random() - 0.5) * 28));
  rootDate.setMonth(rootDate.getMonth() + labCount);
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
    name: loremIpsum().split(' ').slice(0, 3).join(' '),
    description: `<h1>tag!</h1>${loremIpsum()}`,
    descriptionShort: `<h1>tag!</h1>${loremIpsum()}`,
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
    resourceId: grabRandomResource()._id,
  });
}

export async function getCoursesListMockResponse() {
  return Promise.resolve({ courses: inMemoryCourseMocks.map((x) => new Course(x)) });
}

export async function getCourseMockResponse(_id: string): Promise<IGetCourseResponse> {
  const f = inMemoryCourseMocks.find((x) => x._id === _id);
  if (f) {
    return Promise.resolve({ course: new Course(f) });
  }
  return Promise.reject(new Error('404 not found'));
}

export async function getCourseGroupMockResponse(
  courseID: string, groupID: string,
): Promise<IGetCourseGroupResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  if (course && group) {
    return Promise.resolve(
      { group: new CourseGroup(group), courseId: course?._id, courseName: course?.name },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function putCourseMockResponse(course: Course): Promise<IPostCourseResponse> {
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
  const n = new Course({
    ...course,
    _id: v4(),
  });
  inMemoryCourseMocks.push(n);

  return Promise.resolve({ ok: true, course: (await getCourseMockResponse(n._id)).course });
}

export async function deleteCourseMockResponse(_id: string) {
  const f = inMemoryCourseMocks.findIndex((x) => x._id === _id);
  if (f > -1) {
    inMemoryCourseMocks.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Course to delete not found'));
}

export async function setCourseGroupResponse(
  courseID: string,
  group: CourseGroup,
): Promise<IPostCourseGroupResponse> {
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
    course.groups.push(new CourseGroup({
      ...group,
      _id: v4(),
    }));
    return Promise.resolve(
      // eslint-disable-next-line no-await-in-loop
      { ok: true, group: (await getCourseGroupMockResponse(course._id, group._id)).group },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function getLaboratoryMockResponse(
  courseID: string,
  labID: string,
): Promise<IGetLaboratoryResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const lab = course && course.laboratories.find((x) => x._id === labID);

  if (course && lab) {
    course.groups.forEach((group) => {
      if (!Object.keys(lab.tasks).includes(group._id)) {
        lab.tasks[group._id] = new CourseTask();
      }
    });
    return Promise.resolve(
      { laboratory: new CourseLaboratory(lab), courseName: course.name, courseId: course._id },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function setCourseLabMockResponse(
  courseID: string,
  lab: CourseLaboratory,
): Promise<IPutCourseLaboratoryResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  if (!course) {
    return Promise.reject(new Error('404 not found'));
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
    const topush = new CourseLaboratory({
      ...lab,
      _id: v4(),
    });
    course.laboratories.push(topush);
    return Promise.resolve(
      // eslint-disable-next-line no-await-in-loop
      {
        ok: true,
        laboratory: (await getLaboratoryMockResponse(course._id, topush._id)).laboratory,
      },
    );
  }
  return Promise.reject(new Error('404 not found'));
}

export async function patchCourseGroupStudentMockResponse(
  courseID: string,
  groupID: string,
): Promise<IPatchCourseGroupStudentResponse> {
  const course = inMemoryCourseMocks.find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x._id === groupID);
  const { student } = await getStudentMockResponse();
  if (course && group && student) {
    if (!group.students.find((x) => x._id === student._id)) {
      group.students.push(student);
    }
    return Promise.resolve({ ok: true, group });
  }
  return Promise.reject(new Error('404 not found'));
}

export async function deleteGroupMockResponse(_id: string): Promise<IApiPostResponse> {
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
): Promise<IApiPostResponse> {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getDashboardLaboratoriesMockResponse(days: number):
Promise<IGetDashboardLaboratoriesResponse> {
  const d1 = new Date();
  d1.setDate(d1.getDate() + 1);
  const d2 = new Date();
  d2.setDate(d2.getDate() + 7);
  return Promise.resolve({
    laboratories: [
      {
        startsAt: new Date(new Date().valueOf() - 60 * 60 * 1000),
        endsAt: new Date(new Date().valueOf() + 60 * 60 * 1000),
        courseId: v4(),
        courseName: 'some course name',
        labId: v4(),
        groupId: v4(),
        groupName: 'some group',
        labName: 'some lab name',
        active: true,
      },
      {
        startsAt: d1,
        endsAt: new Date(d1.valueOf() + 60 * 60 * 1000),
        courseId: v4(),
        courseName: 'some course name',
        labId: v4(),
        groupId: v4(),
        groupName: 'some group',
        labName: 'some lab name',
        active: false,
      },
      {
        startsAt: d2,
        endsAt: new Date(d2.valueOf() + 60 * 60 * 1000),
        courseId: v4(),
        courseName: 'some course name',
        labId: v4(),
        groupId: v4(),
        groupName: 'some group',
        labName: 'some lab name',
        active: true,
      },
    ],
  });
}

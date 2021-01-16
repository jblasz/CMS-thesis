import { loremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import { Course, CourseLanguage } from '../../interfaces/course';
import { CourseGroup } from '../../interfaces/courseGroup';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseTask, ICourseTask } from '../../interfaces/courseTask';
import { SubmissionGrade } from '../../interfaces/misc';
import { Permission } from '../../interfaces/resource';
import { IStudent, Student } from '../../interfaces/student';
import { generateList, shuffleList } from '../../utils';
import {
  getIMCourses, getIMResources, getIMStudents, getIMSubmissions, setIMCourses, setIMResources,
} from './in-memory-database';

const labCount = 0;

let generatorCount = 0;

let studentGeneratorCount = 0;

export function generateSubmissionMock(task: ICourseTask, student: IStudent) {
  const submissions = getIMSubmissions();
  submissions.push({
    _id: v4(),
    forLabID: task.forLabId || v4(),
    forLabName: task.forLabName || 'lab name',
    note: loremIpsum(),
    submittedAt: new Date(0),
    submittedBy: student,
    final: Math.random() > 0.5,
    forCourseID: v4(),
    forCourseName: 'course name',
    forGroupID: v4(),
    forGroupName: 'group name',
    grade: Math.random() > 0.5
      ? SubmissionGrade.A
      : Math.random() > 0.5 ? SubmissionGrade.F : undefined,
  });
}

export function getRandomStudents(count: number) {
  return shuffleList([...getIMStudents()]).slice(0, count - 1) as IStudent[];
}

export function generateStudentMock(id = v4()) {
  const students = getIMStudents();
  const n = studentGeneratorCount++;
  const s = new Student({
    _id: id,
    email: `mail_${n}@domain.com`,
    contactEmail: 'contactemail1',
    name: `student Mk ${n}`,
    usosId: '123321',
  });
  students.push(s);
  return s;
}

export function generateStudentMocks(count = 100) {
  generateStudentMock('staticStudentID');
  for (let i = 0; i < count - 1; i++) {
    generateStudentMock();
  }
}

export function generateResourceMocks(count = 10) {
  const resources = getIMResources();
  generateList(count).forEach(() => resources.push(
    {
      _id: v4(),
      name: loremIpsum().split(' ').slice(0, 3).join(' '),
      usedBy: [],
      permission: Permission.ALL,
    },
  ));
  setIMResources(resources);
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
    resourceId: (getIMResources()[0] && getIMResources()[0]._id) || undefined,
    location: '',
  });
}

export function generateCourseMock(id = v4()) {
  const groups = generateList(2, 2).map(() => generateCourseGroupMock());
  const topush = new Course({
    _id: id,
    name: `Course Name Mk${generatorCount++}`,
    description: `<span style="color: rgb(26,188,156);"><em>inline styling</em></span> ${loremIpsum()}`,
    descriptionShort: `<span style="color: rgb(255,0,0);"><em>inline styling</em></span> ${loremIpsum()}`,
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 5).map(() => generateLaboratoryMock(groups)),
    active: Math.random() > 0.5,
    shown: true,
  });
  setIMCourses([...getIMCourses(), topush]);
}

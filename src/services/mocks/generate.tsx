import { loremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import { Course, CourseLanguage, ICourse } from '../../interfaces/course';
import { CourseGroup, ICourseGroup } from '../../interfaces/courseGroup';
import { CourseLaboratory, TaskToGroupMapping } from '../../interfaces/courseLaboratory';
import { CourseTask, ICourseTask } from '../../interfaces/courseTask';
import { SubmissionGrade } from '../../interfaces/misc';
import { Permission } from '../../interfaces/resource';
import { IStudent, Student } from '../../interfaces/student';
import { generateList, shuffleList } from '../../utils';
import {
  getIMCourses,
  getIMResources,
  getIMStudents,
  getIMSubmissions,
  setIMCourses,
  setIMResources,
  setIMStudents,
  setIMSubmissions,
} from './in-memory-database';

let generatorCount = 0;

let studentGeneratorCount = 0;

export function generateSubmissionMock(
  course: ICourse,
  task: ICourseTask,
  group: ICourseGroup,
  student: IStudent,
) {
  const submissions = getIMSubmissions();
  submissions.push({
    _id: v4(),
    forLabID: task.forLabId || v4(),
    forLabName: task.forLabName || 'lab name',
    note: loremIpsum(),
    submittedAt: new Date(task.dateFrom || 0),
    submittedBy: student,
    final: Math.random() > 0.2,
    forCourseID: course._id,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    grade: Math.random() > 0.5
      ? SubmissionGrade.A
      : Math.random() > 0.5 ? SubmissionGrade.F : undefined,
  });
  setIMSubmissions(submissions);
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
  setIMStudents(students);
  return s;
}

export function generateStudentMocks(count = 20) {
  generateStudentMock('115746765603275561022');
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

export function generateLaboratoryMock(
  rootDate: Date, groups: CourseGroup[] = [], id = v4(),
): CourseLaboratory {
  const tasks = (groups && groups.reduce(
    (agg: TaskToGroupMapping, group) => ({
      ...agg,
      [group._id]: generateCourseTaskMock(new Date(rootDate), 90 * 60 * 1000),
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

export function generateCourseTaskMock(date: Date, duration: number):CourseTask {
  // offset the time of each task starting a bit
  return new CourseTask({
    _id: v4(),
    description: loremIpsum(),
    gracePeriod: 5,
    ...(date && duration
      ? {
        dateFrom: new Date(date),
        dateTo: new Date(date.valueOf() + duration),
      }
      : {}),
    resourceId: getIMResources()[Math.floor(Math.random() * getIMResources().length)]._id,
    location: '',
  });
}

export async function generateCourseMock(id: string) {
  const groups = generateList(2).map(() => generateCourseGroupMock());
  const rootDate = new Date(new Date().valueOf() - 60 * 24 * 60 * 60 * 1000);
  const topush = new Course({
    _id: id,
    name: `Course Name Mk${generatorCount++}`,
    description: `<span style="color: rgb(26,188,156);"><em>inline styling</em></span> ${loremIpsum()}`,
    descriptionShort: `<span style="color: rgb(255,0,0);"><em>inline styling</em></span> ${loremIpsum()}`,
    language: Math.random() > 0.5 ? CourseLanguage.EN : CourseLanguage.PL,
    semester: `20${Math.random() > 0.5 ? '20' : '21'}${Math.random() > 0.5 ? 'Z' : 'L'}`,
    groups,
    laboratories: generateList(3, 1).map(() => {
      rootDate.setTime(rootDate.valueOf() + 30 * 24 * 60 * 60 * 1000);
      return generateLaboratoryMock(rootDate, groups);
    }),
    active: Math.random() > 0.5,
    shown: true,
  });
  setIMCourses([...getIMCourses(), topush]);
}

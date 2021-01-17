import {
  IGetResourcesResponse,
  IGetStudentCourseResponse,
  IGetStudentCoursesResponse,
  IGetStudentDashboardResponse,
} from '../../interfaces/api';
import { ICourseGroupMetaWithGrade, ICourseLabGroupMetaWithDates } from '../../interfaces/misc';
import { StudentCourse } from '../../interfaces/studentCourse';
import { generateList } from '../../utils';
import {
  generateStudentMocks, generateResourceMocks, generateCourseMock, generateSubmissionMock,
} from './generate';
import { getCoursesListMockResponse } from './in-memory-course-mocks';
import { getIMCourses, getIMResources, getIMStudents } from './in-memory-database';
import { getLabsReferencingResourceId } from './in-memory-resource-mocks';
import { getStudentsMockResponse } from './in-memory-student-mocks';

export async function populateInMemoryDBWithSomeMocks(count = 5) {
  generateStudentMocks(100);
  generateResourceMocks(10);
  generateCourseMock('staticCourseID');
  generateList(count).forEach(() => generateCourseMock());
  const { students } = await getStudentsMockResponse();
  const tasks = (await getCoursesListMockResponse())
    .courses
    .map((x) => Object.values(x.laboratories[0].tasks)[0]);
  generateList(20).forEach(() => generateSubmissionMock(
    tasks[Math.floor(Math.random() * tasks.length)],
    students[Math.floor(Math.random() * students.length)],
  ));
  console.log('generated some mocks for in-memory');
}

export async function getResourcesMockResponse(): Promise<IGetResourcesResponse> {
  return Promise.resolve(
    {
      resources: ((await getIMResources())).map((x) => ({
        _id: x._id,
        name: x.name,
        usedBy: getLabsReferencingResourceId(x._id),
        permission: x.permission,
      })),
    },
  );
}

export async function getStudentDashboardMockResponse(
  studentID: string,
): Promise<IGetStudentDashboardResponse> {
  const student = getIMStudents().find((x) => x._id === studentID);
  if (!student) {
    throw new Error('404');
  }
  const upcoming: ICourseLabGroupMetaWithDates[] = [];
  getIMCourses().forEach((course) => {
    const group = course.groups.find((x) => x.students.find((s) => s._id === student._id));
    if (!group) {
      return;
    }
    const highRange = new Date(new Date().valueOf() + 7 * 24 * 60 * 60 * 1000);
    course.laboratories.forEach((laboratory) => {
      const task = laboratory.tasks[group._id];
      if (task
        && task.dateFrom
         && task.dateTo
          && task.dateTo.valueOf() <= highRange.valueOf()
      ) {
        upcoming.push({
          active: course.active,
          courseId: course._id,
          courseName: course.name,
          endsAt: task.dateTo,
          groupId: group._id,
          groupName: group.name,
          labId: laboratory._id,
          labName: laboratory.name,
          startsAt: task.dateFrom,
        });
      }
    });
  });
  return Promise.resolve({
    upcoming,
  });
}

export async function getStudentCoursesMockResponse(
  studentID: string,
): Promise<IGetStudentCoursesResponse> {
  const student = getIMStudents().find((x) => x._id === studentID);
  if (!student) {
    throw new Error('404');
  }
  const courses: ICourseGroupMetaWithGrade[] = [];
  getIMCourses().forEach((course) => {
    const group = course.groups.find((x) => x.students.find((s) => s._id === student._id));
    if (!group) {
      return;
    }
    const grade = group.students.find((x) => x._id === student._id)?.grade;
    courses.push({
      active: course.active,
      courseId: course._id,
      courseName: course.name,
      groupId: group._id,
      groupName: group.name,
      grade,
    });
  });
  return Promise.resolve({
    courses,
  });
}

export async function getStudentCourseMockResponse(
  studentID: string, courseID: string,
): Promise<IGetStudentCourseResponse> {
  const student = getIMStudents().find((x) => x._id === studentID);
  const course = getIMCourses().find((x) => x._id === courseID);
  const group = course && course.groups.find((x) => x.students.find((y) => y._id === studentID));
  const laboratories = course && group && course.laboratories;
  if (!student || !course || !group) {
    console.error(student, course, group);
    throw new Error('404');
  }

  const inGroupStudent = group.students.find((x) => x._id === studentID);
  const grade = inGroupStudent && inGroupStudent.grade;

  return Promise.resolve({
    course: StudentCourse({
      _id: courseID,
      active: course.active,
      description: course.description,
      groupId: group._id,
      groupName: group.name,
      language: course.language,
      name: course.name,
      semester: course.semester,
      grade,
      laboratories: laboratories
        ? laboratories.map((lab) => ({
          _id: lab._id,
          name: lab.name,
          ...(lab.tasks[group._id] && lab.tasks[group._id].dateFrom
            ? { dateFrom: lab.tasks[group._id].dateFrom }
            : {}),
          ...(lab.tasks[group._id] && lab.tasks[group._id].dateTo
            ? { dateTo: lab.tasks[group._id].dateTo }
            : {}),
        })) : [],
    }),
  });
}

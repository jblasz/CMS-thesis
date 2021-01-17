import {
  IGetResourcesResponse,
  IGetStudentCourseResponse,
  IGetStudentCoursesResponse,
  IGetStudentDashboardResponse,
} from '../../interfaces/api';
import { ICourse } from '../../interfaces/course';
import { ICourseGroupMetaWithGrade, ICourseLabGroupMetaWithDates, SubmissionGrade } from '../../interfaces/misc';
import { IStudent } from '../../interfaces/student';
import { StudentCourse } from '../../interfaces/studentCourse';
import { generateList } from '../../utils';
import {
  generateResourceMocks, generateCourseMock, generateSubmissionMock, generateStudentMock,
} from './generate';
import {
  getIMCourses, getIMResources, getIMStudents, getIMSubmissions, setIMSubmissions,
} from './in-memory-database';
import { getLabsReferencingResourceId } from './in-memory-resource-mocks';

const studentCount = 20;

export async function populateInMemoryDBWithSomeMocks(count = 5) {
  // and some fake fillers
  for (let i = 0; i < studentCount - 1; i++) {
    generateStudentMock();
  }

  generateResourceMocks(10);
  generateCourseMock('staticCourseID');
  generateList(count).forEach((val) => generateCourseMock(`course_id_${val}`));

  // generate submissions to some random tasks
  getIMCourses().forEach((course) => {
    generateList(20).forEach(() => {
      const group = course.groups[Math.floor(Math.random() * course.groups.length)];
      const student = group.students[Math.floor(Math.random() * group.students.length)];
      const lab = course.laboratories[Math.floor(Math.random() * course.laboratories.length)];
      const task = lab.tasks[group._id];

      generateSubmissionMock(
        course,
        task,
        group,
        student,
      );
    });
  });

  // generate static admin account with their google id
  generateStudentMock('115746765603275561022');
  // sign up the admin for a single course
  const course = getIMCourses().find((x) => x._id === 'staticCourseID') as ICourse;
  const student = getIMStudents().find((x) => x._id === '115746765603275561022') as IStudent;
  const group = course.groups[0];
  group.students.push(student);
  const lab = course.laboratories[0];
  // say they have made a couple of submissions
  setIMSubmissions([{
    _id: 'staticSubmission0',
    final: true,
    forCourseID: course._id,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    forLabID: lab._id,
    forLabName: lab.name,
    note: 'Note to submission',
    submittedAt: new Date(),
    submittedBy: student,
    grade: SubmissionGrade.A,
  },
  {
    _id: 'staticSubmission1',
    final: false,
    forCourseID: course._id,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    forLabID: lab._id,
    forLabName: lab.name,
    note: 'Note to a non-final submission submission',
    submittedAt: new Date(0),
    submittedBy: student,
  }, {
    _id: 'staticSubmission2',
    final: true,
    forCourseID: course._id,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    forLabID: course.laboratories[1]._id,
    forLabName: course.laboratories[1].name,
    note: 'Note to failed submission',
    submittedAt: new Date(),
    submittedBy: student,
    grade: SubmissionGrade.F,
  }, {
    _id: 'staticSubmission3',
    final: true,
    forCourseID: course._id,
    forCourseName: course.name,
    forGroupID: group._id,
    forGroupName: group.name,
    forLabID: course.laboratories[2]._id,
    forLabName: course.laboratories[2].name,
    note: 'Note to not yet resolved submission',
    submittedAt: new Date(),
    submittedBy: student,
  },
  ...getIMSubmissions(),
  ]);

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
    const now = new Date();
    const highRange = new Date(now.valueOf() + 31 * 24 * 60 * 60 * 1000);
    course.laboratories.forEach((laboratory) => {
      const task = laboratory.tasks[group._id];
      if (task
        && task.dateFrom
        && task.dateTo
        && (
          (task.dateFrom.valueOf() < now.valueOf() && task.dateTo.valueOf() > now.valueOf())
        || (task.dateFrom.valueOf() > now.valueOf() && task.dateFrom.valueOf() < highRange.valueOf()
        ))
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
  const submissions = getIMSubmissions().filter((x) => x.forCourseID === course._id);

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
        ? laboratories.map((lab) => {
          const taskId = lab.tasks[group._id] && lab.tasks[group._id].resourceId;
          const sub = submissions.find((x) => x.final && x.forLabID === lab._id);
          return ({
            _id: lab._id,
            name: lab.name,
            ...(taskId ? { taskId } : {}),
            ...(sub ? { latestSubmissionId: sub._id } : {}),
            ...(lab.tasks[group._id] && lab.tasks[group._id].dateFrom
              ? { dateFrom: lab.tasks[group._id].dateFrom }
              : {}),
            ...(lab.tasks[group._id] && lab.tasks[group._id].dateTo
              ? { dateTo: lab.tasks[group._id].dateTo }
              : {}),
          });
        }) : [],
    }),
  });
}

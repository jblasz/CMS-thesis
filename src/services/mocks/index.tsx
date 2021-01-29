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
  getIMArticles,
  getIMCourses,
  getIMLandingPage,
  getIMResources,
  getIMStudents,
  getIMSubmissions,
  setIMArticles,
  setIMLandingPage,
  setIMSubmissions,
} from './in-memory-database';
import { getLabsReferencingResourceId } from './in-memory-resource-mocks';

const studentCount = 5;

export async function populateInMemoryDBWithSomeMocks() {
  // and some fake fillers
  for (let i = 0; i < studentCount - 1; i++) {
    generateStudentMock();
  }

  generateResourceMocks(10);
  generateCourseMock('staticCourseID');
  // 2 full courses
  generateList(2).forEach((val) => generateCourseMock(`course_id_${val}`));

  // generate submissions to some random tasks
  getIMCourses().forEach((course) => {
    generateList(20).forEach(() => {
      const group = course.groups[Math.floor(Math.random() * course.groups.length)];
      const student = group.students[Math.floor(Math.random() * group.students.length)];
      const lab = course.laboratories[Math.floor(Math.random() * course.laboratories.length)];
      const task = lab.tasks[group._id];

      if (!task.forLabId) {
        task.forLabId = lab._id;
        task.forLabName = lab.name;
      }

      generateSubmissionMock(
        course,
        task,
        group,
        student,
      );
    });
  });

  // mock for bypassing google login
  generateStudentMock('mock-id');

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

  // varied course types
  generateCourseMock('course-with-groups', 'Course with groups, no labs', false, true, true);
  generateCourseMock('course-with-labs', 'Course with labs, no groups', true, false, true);
  generateCourseMock('course-with-nothing', 'No labs, groups or gods', false, false, true);

  // 3 articles
  setIMArticles([
    ...getIMArticles(),
    {
      _id: 'standalone-article',
      sortWeight: 0,
      en: {
        categoryMajor: 'Contact',
        categoryMinor: '',
        contents: `
        <div style="margin-top: 10vh">
          I take public consultations only <i>by previous appointment</i>.</br>
          Postal address: 24 Cavendish Square, 213-123 London</br>
          Phone: Invented for 10 years, but I have not procured one yet. You can contact me by carrier pidgeon if you like.</br>
          Email: What is an email? This is 1886</br>
          </div>
        `,
      },
      pl: {
        categoryMajor: 'Kontakt',
        categoryMinor: '',
        contents: `
        <div style="margin-top: 10vh">
          Konsultacje <i>za wcześniejszym umówieniem</i>.</br>
          Postal address: 24 Cavendish Square, 213-123 London</br>
          Phone: Invented for 10 years, but I have not procured one yet. You can contact me by carrier pidgeon if you like.</br>
          Email: What is an email? This is 1886</br>
        </div>
        `,
      },
    },
    {
      _id: 'faq-1',
      sortWeight: 0,
      en: {
        categoryMajor: 'FAQ',
        categoryMinor: 'Who is mr Hyde?',
        contents: `
        <div style="margin-top: 10vh">
        A dear friend of mine.
        </div>
        `,
      },
      pl: {
        categoryMajor: 'FAQ',
        categoryMinor: 'Kim jest mr Hyde?',
        contents: `
        <div style="margin-top: 10vh">
        Bliski przyjaciel.
        </div>
        `,
      },
    },
    {
      _id: 'faq-2',
      sortWeight: 0,
      en: {
        categoryMajor: 'FAQ',
        categoryMinor: 'Personal interests',
        contents: `
        <div style="margin-top: 10vh">
        <i>A respected doctor and friend of both Lanyon, a fellow physician, and Utterson, a lawyer. Jekyll is a seemingly prosperous man, well established in the community, and known for his decency and charitable works..</i> - Robert Louis Stevenson
        </div>
        `,
      },
      pl: {
        categoryMajor: 'FAQ',
        categoryMinor: 'Zainteresowania',
        contents: `
        <div style="margin-top: 10vh">
        <i>A respected doctor and friend of both Lanyon, a fellow physician, and Utterson, a lawyer. Jekyll is a seemingly prosperous man, well established in the community, and known for his decency and charitable works..</i> - Robert Louis Stevenson
        </div>
        `,
      },
    },
  ]);

  setIMLandingPage('<h1 style="text-align:center;"><span style="color: rgb(0,0,0);">Dr Henry Jekyll</span></h1> <h3 style="text-align:center;"><span style="color: rgb(0,0,0);">Doctor of medicine, Canon Law, Legum Doctor, Fellowship of the Royal Society</span></h3> ');
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
          dateTo: task.dateTo,
          groupId: group._id,
          groupName: group.name,
          labId: laboratory._id,
          labName: laboratory.name,
          dateFrom: task.dateFrom,
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

export async function getLandingPageMockResponse() {
  return Promise.resolve({
    landingPage: getIMLandingPage(),
  });
}

export async function putLandingPageMockResponse(v: string) {
  setIMLandingPage(v);
  return Promise.resolve({
    landingPage: getIMLandingPage(),
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
            ...(sub && sub.grade ? { grade: sub.grade } : {}),
          });
        }) : [],
    }),
  });
}

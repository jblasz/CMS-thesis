import { v4 } from 'uuid';
import { GetStudentResponse, IGetUserResponse, IPostUserResponse } from '../../interfaces/api';
import { SubmissionGrade } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import { shuffleList } from '../../utils';

const inMemoryStudentMocks: Student[] = [];

let generatorCount = 0;

export async function getUserMockResponse(): Promise<IGetUserResponse> {
  return Promise.resolve({
    student: inMemoryStudentMocks[0],
    attends: [],
    submissions: [],
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function postUserMockResponse(jwt: string): Promise<IPostUserResponse> {
  return Promise.resolve({
    student: inMemoryStudentMocks[0],
    attends: [
      {
        courseId: v4(),
        courseName: 'course name',
        groupId: v4(),
        groupName: 'group name',
        active: true,
      },
      {
        courseId: v4(),
        courseName: 'course name',
        groupId: v4(),
        groupName: 'group name',
        active: false,
      },
    ],
    submissions: [
      {
        _id: v4(),
        final: true,
        forCourseID: v4(),
        forCourseName: 'course name',
        forGroupID: v4(),
        forGroupName: 'group name',
        forLabID: v4(),
        forLabName: 'lab name',
        note: 'students optional note',
        submittedAt: new Date(Date.UTC(2020, 3, 1)),
        submittedBy: new Student(),
        grade: SubmissionGrade.A,
      },
      {
        _id: v4(),
        final: true,
        forCourseID: v4(),
        forCourseName: 'course name 2',
        forGroupID: v4(),
        forGroupName: 'group name 2',
        forLabID: v4(),
        forLabName: 'lab name 2',
        note: 'students optional note',
        submittedAt: new Date(Date.UTC(2020, 3, 1)),
        submittedBy: new Student(),
        grade: SubmissionGrade.B_PLUS,
      },
    ],
  });
}

export function getRandomStudents(count: number) {
  return shuffleList([...inMemoryStudentMocks]).slice(0, count - 1) as Student[];
}

export function generateStudentMock(id = v4()) {
  const n = generatorCount++;
  const s = new Student({
    _id: id,
    email: `mail_${n}@domain.com`,
    contactEmail: 'contactemail1',
    name: `student Mk ${n}`,
    usosId: '123321',
  });
  inMemoryStudentMocks.push(s);
  return s;
}

export function generateStudentMocks(count = 100) {
  generateStudentMock('staticStudentID');
  for (let i = 0; i < count - 1; i++) {
    generateStudentMock();
  }
}

export function getStudentMockResponse(): Promise<GetStudentResponse> {
  const student = inMemoryStudentMocks[0];
  return student
    ? Promise.resolve({
      student,
      attends: [
        {
          courseId: v4(),
          courseName: 'course name',
          groupId: v4(),
          groupName: 'group name',
          active: true,
        },
        {
          courseId: v4(),
          courseName: 'course name',
          groupId: v4(),
          groupName: 'group name',
          active: false,
          grade: SubmissionGrade.B,
        },
      ],
      submissions: [
        {
          _id: v4(),
          final: true,
          forCourseID: v4(),
          forCourseName: 'course name',
          forGroupID: v4(),
          forGroupName: 'group name',
          forLabID: v4(),
          forLabName: 'lab name',
          note: 'students optional note',
          submittedAt: new Date(Date.UTC(2020, 3, 1)),
          submittedBy: new Student(),
          grade: SubmissionGrade.A,
        },
        {
          _id: v4(),
          final: true,
          forCourseID: v4(),
          forCourseName: 'course name 2',
          forGroupID: v4(),
          forGroupName: 'group name 2',
          forLabID: v4(),
          forLabName: 'lab name 2',
          note: 'students optional note',
          submittedAt: new Date(Date.UTC(2020, 3, 1)),
          submittedBy: new Student(),
          grade: SubmissionGrade.B_PLUS,
        },
      ],
    }) : Promise.reject();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getStudentsMockResponse(byCourseId?: string) {
  return Promise.resolve({ students: inMemoryStudentMocks.map((x) => new Student(x)) });
}

export function deleteStudentMockResponse(id: string) {
  const f = inMemoryStudentMocks.findIndex((x) => x._id === id);
  if (f > -1) {
    inMemoryStudentMocks.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Student of this id not found'));
}

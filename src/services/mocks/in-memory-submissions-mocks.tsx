import { v4 } from 'uuid';
import { CourseTask } from '../../interfaces/courseTask';
import { SubmissionGrade, SubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';

const inMemorySubmissions: SubmissionMeta[] = [];

export function generateSubmissionMock(task: CourseTask, student: Student) {
  inMemorySubmissions.push({
    _id: v4(),
    forLabID: task.forLabId || v4(),
    forLabName: task.forLabName || 'lab name',
    note: 'submission note',
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

export function getSubmissionsMockResponse(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  courseFilter: string, studentFilter: string, statusFilter: number,
) {
  return Promise.resolve({ submissions: inMemorySubmissions.map((x) => ({ ...x })) });
}

export function getSubmissionMockResponse(id: string) {
  const f = inMemorySubmissions.find((x) => x._id === id);
  if (f) {
    return Promise.resolve({ submission: f });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

export function deleteSubmissionMockResponse(id: string) {
  const f = inMemorySubmissions.findIndex((x) => x._id === id);
  if (f > -1) {
    inMemorySubmissions.splice(f, 1);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

export function patchSubmissionMockResponse(submission: SubmissionMeta) {
  const f = inMemorySubmissions.findIndex((x) => x._id === submission._id);
  if (f > -1) {
    inMemorySubmissions[f] = submission;
    return Promise.resolve({ ok: true, submission });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

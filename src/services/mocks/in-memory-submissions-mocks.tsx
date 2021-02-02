import { IGetAdminDashboardResponse } from '../../interfaces/api';
import { ISubmissionMeta } from '../../interfaces/resource';
import { getIMSubmissions, setIMSubmissions } from './in-memory-database';

export async function getAdminDashboardMockResponse(): Promise<IGetAdminDashboardResponse> {
  return Promise.resolve({
    unmarkedSolutionsCount:
      getIMSubmissions().reduce((agg, curr) => (curr.grade ? agg : agg + 1), 0),
  });
}

export function getSubmissionsMockResponse(
  courseFilter: string, studentFilter: string, statusFilter: number, final = true,
) {
  const submissions = getIMSubmissions().filter((x) => x.forCourseID.includes(courseFilter)
    && x.submittedBy._id.includes(studentFilter)
    && (
      statusFilter === 0
      || (statusFilter === 1 && x.grade)
      || (statusFilter === 2 && !x.grade)
    )
    && x.final === final);
  return Promise.resolve({ submissions });
}

export function getSubmissionMockResponse(id: string) {
  const f = getIMSubmissions().find((x) => x._id === id);
  if (f) {
    return Promise.resolve({ submission: f });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

export function deleteSubmissionMockResponse(id: string) {
  const submissions = getIMSubmissions();
  const f = submissions.findIndex((x) => x._id === id);
  if (f > -1) {
    submissions.splice(f, 1);
    setIMSubmissions(submissions);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

export function patchSubmissionMockResponse(submission: ISubmissionMeta) {
  const f = getIMSubmissions().findIndex((x) => x._id === submission._id);
  if (f > -1) {
    getIMSubmissions()[f] = submission;
    return Promise.resolve({ ok: true, submission });
  }
  return Promise.reject(new Error('Submission of this id not found'));
}

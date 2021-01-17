import { IGetAdminDashboardResponse } from '../../interfaces/api';
import { ISubmissionMeta } from '../../interfaces/resource';
import { getIMSubmissions, setIMSubmissions } from './in-memory-database';

enum StatusFilter {
  ALL = 0,
  UNGRADED,
  GRADED,
}

export async function getAdminDashboardMockResponse(): Promise<IGetAdminDashboardResponse> {
  return Promise.resolve({
    unmarkedSolutionsCount:
      getIMSubmissions().reduce((agg, curr) => (curr.grade ? agg : agg + 1), 0),
  });
}

export function getSubmissionsMockResponse(
  courseFilter: string, studentFilter: string, statusFilter: StatusFilter,
) {
  const submissions = getIMSubmissions().filter((x) => x.forCourseID === courseFilter
    && x.submittedBy._id === studentFilter
    && (
      statusFilter === StatusFilter.ALL
      || (statusFilter === StatusFilter.GRADED && x.grade)
      || (statusFilter === StatusFilter.UNGRADED && !x.grade)
    ));
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

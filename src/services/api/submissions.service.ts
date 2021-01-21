import { config } from '../../config';
import {
  IApiPostResponse, IGetSubmissionsResponse, IPatchSubmissionResponse,
} from '../../interfaces/api';
import { ISubmissionMeta, SubmissionMeta } from '../../interfaces/resource';
import {
  deleteSubmissionMockResponse,
  getSubmissionsMockResponse,
  patchSubmissionMockResponse,
} from '../mocks/in-memory-submissions-mocks';
import { axiosInstance } from './request.service';

/**
 * /submissions GET
 */
export async function getSubmissions(
  courseFilter: string, studentFilter: string, statusFilter: number, final = true,
): Promise<IGetSubmissionsResponse> {
  if (config.useMocks) {
    return getSubmissionsMockResponse(courseFilter, studentFilter, statusFilter, final);
  }
  const { data } = await axiosInstance.get('/submissions', {
    params: {
      course: courseFilter,
      student: studentFilter,
      status: statusFilter,
      final,
    },
  });
  const { submissions } = data as IGetSubmissionsResponse;
  return { submissions: submissions.map((x) => SubmissionMeta(x)) };
}

/**
 * /submissions/:id GET
 */
export async function getSubmission(id: string) {
  // if (config.useMocks) {
  //   return getSubmissionMockResponse(id);
  // }
  const a = document.createElement('a');
  a.target = '_blank';
  a.href = `${axiosInstance.defaults.baseURL}/submissions/${id}`;
  a.click();
  return Promise.resolve({});
  // const { data } = await axiosInstance.get(`/submissions/${id}`);
  // const { submission } = data as IGetSubmissionResponse;
  // return { submission: SubmissionMeta(submission) };
}

/**
 * /submissions/:id DELETE
 */
export async function deleteSubmission(id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteSubmissionMockResponse(id);
  }
  const { data } = await axiosInstance.delete(`/submissions/${id}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}

/**
 * /submissions/:id PATCH
 */

export async function patchSubmission(
  submission: ISubmissionMeta,
): Promise<IPatchSubmissionResponse> {
  if (config.useMocks) {
    return patchSubmissionMockResponse(submission);
  }
  const {
    submittedBy, forLabID, submittedAt, note, grade,
  } = submission;
  const { data } = await axiosInstance.patch(`/submissions/${submission._id}`, {
    ...(submittedBy ? { submittedByStudentId: submittedBy._id } : {}),
    ...(forLabID ? { forLabId: forLabID } : {}),
    ...(submittedAt ? { submittedAt } : {}),
    ...(note ? { note } : {}),
    ...(grade ? { grade } : {}),
  });
  const { ok, submission: _submission } = data as IPatchSubmissionResponse;
  return { ok, submission: SubmissionMeta(_submission) };
}

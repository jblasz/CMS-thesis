import {
  ApiPostResponse, GetSubmissionResponse, GetSubmissionsResponse, PatchSubmissionResponse,
} from '../../interfaces/api';
import { SubmissionMeta } from '../../interfaces/resource';
import {
  deleteSubmissionMockResponse,
  getSubmissionMockResponse,
  getSubmissionsMockResponse,
  patchSubmissionMockResponse,
} from '../mocks/in-memory-submissions-mocks';

/**
 * /submissions GET
 */
export function getSubmissions(): Promise<GetSubmissionsResponse> {
  return getSubmissionsMockResponse();
}

/**
 * /submissions/:id GET
 */
export function getSubmission(id: string): Promise<GetSubmissionResponse> {
  return getSubmissionMockResponse(id);
}

/**
 * /submissions DELETE
 */
export function deleteSubmission(id: string): Promise<ApiPostResponse> {
  return deleteSubmissionMockResponse(id);
}

/**
 * /submissions PATCH
 */

export function patchSubmission(submission: SubmissionMeta): Promise<PatchSubmissionResponse> {
  return patchSubmissionMockResponse(submission);
}

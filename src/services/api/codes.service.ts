import {
  ApiPostResponse, GetCodesResponse, PostCodeNewResponse, PostCodeResponse,
} from '../../interfaces/api';
import {
  deleteCodeMockResponse, getCodesMockResponse, postCodeMockResponse, postCodeNewMockResponse,
} from '../mocks/in-memory-code-mocks';

/**
 * /code POST
 */
export async function postCode(code: string): Promise<PostCodeResponse> {
  return postCodeMockResponse(code);
}

/**
 * /code GET
 */
export async function getCodes(grabInactive = false, courseId?:string): Promise<GetCodesResponse> {
  return getCodesMockResponse(grabInactive, courseId);
}

/**
 * /code/:courseId POST
 */
export async function postCodeNew(
  courseId: string, validThrough: Date,
): Promise<PostCodeNewResponse> {
  return postCodeNewMockResponse(courseId, validThrough);
}

/**
 * /code/:id DELETE
 */

export async function deleteCode(code: string): Promise<ApiPostResponse> {
  return deleteCodeMockResponse(code);
}

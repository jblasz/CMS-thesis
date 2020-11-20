import { GetUserResponse, PostUserResponse } from '../../interfaces/api';
import { getUserMockResponse, postUserMockResponse } from '../mocks/in-memory-student-mocks';

/**
 * /user POST
 */
export async function postUser(jwt: string): Promise<PostUserResponse> {
  return postUserMockResponse(jwt);
}

/**
 * /user GET
 */
export async function getUser(): Promise<GetUserResponse> {
  return getUserMockResponse();
}

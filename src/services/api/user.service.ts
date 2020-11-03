import { PostUserResponse } from '../../interfaces/api';
import { postUserMockResponse } from '../mocks/in-memory-student-mocks';

/**
 * /user POST
 */
export async function postUser(jwt: string): Promise<PostUserResponse> {
  return postUserMockResponse(jwt);
}

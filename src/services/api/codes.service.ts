import { PostCodeResponse } from '../../interfaces/api';
import { postCodeMockResponse } from '../mocks/in-memory-code-mocks';

/**
 * /code POST
 */
export async function postCode(code: string): Promise<PostCodeResponse> {
  return postCodeMockResponse(code);
}

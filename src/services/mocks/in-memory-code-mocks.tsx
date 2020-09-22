import { PostCodeResponse, PostCodeResponseType } from '../../interfaces/api';
import { getCourseMockResponse } from './in-memory-course-mocks';

export async function postCodeMockResponse(code: string): Promise<PostCodeResponse> {
  if (code === 'course-signup-mock-code') {
    return Promise.resolve({
      ok: true,
      type: PostCodeResponseType.COURSE_SIGNUP,
      courseSignup: (await getCourseMockResponse('staticCourseID')).course,
    });
  }
  return Promise.reject();
}

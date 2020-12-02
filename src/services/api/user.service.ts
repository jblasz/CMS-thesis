import { config } from '../../config';
import { IGetUserResponse, IPostUserResponse } from '../../interfaces/api';
import { SubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import { getUserMockResponse, postUserMockResponse } from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /user POST
 */
export async function postUser(jwt: string): Promise<IPostUserResponse> {
  if (config.useMocks) {
    return postUserMockResponse(jwt);
  }
  const { data } = await axiosInstance.post('/user', null, {
    withCredentials: true,
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });
  const { attends, student, submissions } = data as IPostUserResponse;
  return {
    attends,
    student: new Student(student),
    submissions: submissions.map((x) => SubmissionMeta(x)),
  };
}

/**
 * /user GET
 */
export async function getUser(): Promise<IGetUserResponse> {
  if (config.useMocks) {
    return getUserMockResponse();
  }
  const { data } = await axiosInstance.get('/user');
  const { student, attends, submissions } = data as IGetUserResponse;
  return {
    attends,
    student: new Student(student),
    submissions: submissions.map((x) => SubmissionMeta(x)),
  };
}

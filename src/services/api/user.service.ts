import { config } from '../../config';
import {
  IPostUserResponse,
  IApiPostResponse, GetStudentResponse, IGetStudentsResponse, PatchStudentResponse,
} from '../../interfaces/api';
import { SubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import {
  postUserMockResponse,
  deleteStudentMockResponse,
  getStudentMockResponse, getStudentsMockResponse,
} from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /user POST
 */
export async function postUser(jwt: string): Promise<IPostUserResponse> {
  if (config.useMocks) {
    return postUserMockResponse(jwt);
  }
  const { data } = await axiosInstance.post('/public/user', {
    tokenId: jwt,
  }, {
    headers: {
      authorization: jwt,
    },
  });
  const { attends, student, submissions } = data as IPostUserResponse;
  return {
    attends,
    student: new Student(student),
    submissions: submissions.map((x) => SubmissionMeta(x)),
  };
}

// replaced by /profile?
/**
//  * /user GET
//  */
// export async function getUser(): Promise<IGetUserResponse> {
//   if (config.useMocks) {
//     return getUserMockResponse();
//   }
//   const { data } = await axiosInstance.get('/user');
//   const { student, attends, submissions } = data as IGetUserResponse;
//   return {
//     attends,
//     student: new Student(student),
//     submissions: submissions.map((x) => SubmissionMeta(x)),
//   };
// }

/**
 * /user GET
 */
export async function getAdminUsers(byCourseId?: string): Promise<IGetStudentsResponse> {
  if (config.useMocks) {
    const { students } = await getStudentsMockResponse(byCourseId);
    return { students: students.map((x) => new Student(x)) };
  }
  const { data } = await axiosInstance.get('/students');
  const { students } = data as IGetStudentsResponse;
  return { students: students.map((x) => new Student(x)) };
}

/**
 * /user/:id GET
 */
export async function getAdminUser(id: string): Promise<GetStudentResponse> {
  if (config.useMocks) {
    const r = await getStudentMockResponse(id);
    return { ...r, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.get(`/students/${id}`);
  const { attends, student, submissions } = data as GetStudentResponse;
  return {
    attends,
    student: new Student(student),
    submissions,
  };
}

/**
 * /user/:id PATCH
 */
export async function patchAdminUser(id: string, params: {
  name?: string
  email?: string
  contactEmail?: string
  usosId?: string
}): Promise<PatchStudentResponse> {
  if (config.useMocks) {
    const r = await getStudentMockResponse(id);
    return { ok: true, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.patch(`/students/${id}`, params);
  const { ok, student } = data as PatchStudentResponse;
  return { ok, student: new Student(student) };
}

/**
 * /students/:id DELETE
 */
export async function deleteAdminUser(id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteStudentMockResponse(id);
  }
  const { data } = await axiosInstance.delete(`/students/${id}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}

import Cookies from 'js-cookie';
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
  getStudentMockResponse, getStudentsMockResponse, patchStudentMockResponse,
} from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /user POST
 */
export async function postUser(
  jwt: string, gid: string, email: string, name: string, usosId: string,
): Promise<IPostUserResponse> {
  if (config.useMocks) {
    return postUserMockResponse(jwt, email, name, usosId);
  }
  const { data, headers: { authorization } } = await axiosInstance.post('/public/user', {
    tokenId: jwt,
  }, {
    headers: {
      authorization: jwt,
    },
  });
  const {
    attends, student, submissions, token,
  } = data as IPostUserResponse;
  if (authorization) {
    Cookies.set('authorization', authorization);
  } else if (token) {
    Cookies.set('authorization', token);
  }
  return {
    token,
    attends,
    student: new Student(student),
    submissions: submissions.map((x) => SubmissionMeta(x)),
  };
}

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
    const r = await patchStudentMockResponse({
      studentID: id,
      name: params.name,
      email: params.email,
      contactEmail: params.contactEmail,
      usosId: params.usosId,
    });
    return { ok: true, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.patch(`/students/${id}`, params);
  const { ok, student } = data as PatchStudentResponse;
  return { ok, student: new Student(student) };
}

/**
 * /user/:id DELETE
 */
export async function deleteAdminUser(id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteStudentMockResponse(id);
  }
  const { data } = await axiosInstance.delete(`/user/${id}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}

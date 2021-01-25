import Cookies from 'js-cookie';
import { config } from '../../config';
import {
  IPostUserResponse,
  IApiPostResponse,
  GetStudentResponse,
  IGetStudentsResponse, PatchStudentResponse, IPostUserAdminResponse,
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
 * /public/user POST
 */
export async function postUser(
  jwt: string, gid: string, email: string, name: string, usosID: string,
): Promise<{
    response: IPostUserResponse,
    isAdmin: boolean
  }> {
  if (config.useMocks) {
    Cookies.set('authorization', jwt);
    return {
      response: await postUserMockResponse(gid, email, name, usosID),
      isAdmin: true,
    };
  }
  const { data, headers: { authorization } } = await axiosInstance.post('/public/user', {
    tokenId: jwt,
  }, {
    headers: {
      authorization: jwt,
    },
  });
  if (data.user) {
    const { token, user } = data as IPostUserAdminResponse;
    if (authorization || token) {
      Cookies.set('authorization', authorization || token);
    }
    return {
      isAdmin: true,
      response: {
        token,
        attends: [],
        student: new Student({
          _id: user._id,
          contactEmail: user.email,
          email: user.email,
          name: user.fullname,
          usosID: '',
          registeredAt: new Date(user.registeredAt),
        }),
        submissions: [],
      },
    };
  }
  const {
    attends, student, submissions, token,
  } = data as IPostUserResponse;
  if (authorization || token) {
    Cookies.set('authorization', authorization || token);
  }
  return {
    isAdmin: false,
    response: {
      token,
      attends,
      student: new Student(student),
      submissions: submissions.map((x) => SubmissionMeta(x)),
    },
  };
}

/**
 * /students GET
 */
export async function getAdminUsers(byCourseId?: string): Promise<IGetStudentsResponse> {
  if (config.useMocks) {
    const { students } = await getStudentsMockResponse(byCourseId);
    return { students: students.map((x) => new Student(x)) };
  }
  const { data } = await axiosInstance.get('/students', {
    params: {
      ...(byCourseId ? { byCourseId } : {}),
    },
  });
  const { students } = data as IGetStudentsResponse;
  return { students: students.map((x) => new Student(x)) };
}

/**
 * /students/:id GET
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
 * /students/:id PATCH
 */
export async function patchAdminUser(id: string, params: {
  name?: string
  email?: string
  contactEmail?: string
  usosID?: string
}): Promise<PatchStudentResponse> {
  if (config.useMocks) {
    const r = await patchStudentMockResponse({
      studentID: id,
      name: params.name,
      email: params.email,
      contactEmail: params.contactEmail,
      usosID: params.usosID,
    });
    return { ok: true, student: new Student(r.student) };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...rest } = params;
  const { data } = await axiosInstance.patch(`/students/${id}`, rest);
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

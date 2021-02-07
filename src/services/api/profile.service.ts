import { appEnv } from '../../appEnv';
import {
  GetStudentResponse, IUserResponse, PatchStudentResponse,
} from '../../interfaces/api';
import { NormalizeCourseGroupMetaWithGrade } from '../../interfaces/misc';
import { SubmissionMeta } from '../../interfaces/resource';
import { Student } from '../../interfaces/student';
import { getStudentMockResponse, patchStudentMockResponse } from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /profile GET
 */
export async function getProfile(studentID: string): Promise<GetStudentResponse> {
  if (appEnv().useMocks) {
    const r = await getStudentMockResponse(studentID);
    return { ...r, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.get('/profile');
  if (data.profile) {
    const {
      _id, email,
      fullname,
      registeredAt,
    } = data.profile as IUserResponse;
    return {
      attends: [],
      student: new Student({
        _id,
        contactEmail: email,
        email,
        name: fullname,
        usosId: '',
        registeredAt: new Date(registeredAt),
      }),
      submissions: [],
    };
  }
  const { attends, student, submissions } = data as GetStudentResponse;
  return {
    attends: attends.map((x) => NormalizeCourseGroupMetaWithGrade(x)),
    student: new Student(student),
    submissions: submissions.map((x) => SubmissionMeta(x)),
  };
}

/**
 * /profile PATCH
 */
export async function patchProfile(params: {
  studentID: string
  name?: string
  email?: string
  contactEmail?: string
  usosId?: string
}): Promise<PatchStudentResponse> {
  if (appEnv().useMocks) {
    const r = await patchStudentMockResponse(params);
    return { ok: true, student: new Student(r.student) };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, studentID, ...rest } = params;
  const { data } = await axiosInstance.patch('/profile', rest);
  const { ok, student } = data as PatchStudentResponse;
  return { ok, student: new Student(student) };
}

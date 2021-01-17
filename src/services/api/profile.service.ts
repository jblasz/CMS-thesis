import { config } from '../../config';
import { GetStudentResponse, PatchStudentResponse } from '../../interfaces/api';
import { Student } from '../../interfaces/student';
import { getStudentMockResponse, patchStudentMockResponse } from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /profile GET
 */
export async function getProfile(studentID: string): Promise<GetStudentResponse> {
  if (config.useMocks) {
    const r = await getStudentMockResponse(studentID);
    return { ...r, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.get('/profile');
  const { attends, student, submissions } = data as GetStudentResponse;
  return {
    attends,
    student: new Student(student),
    submissions,
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
  if (config.useMocks) {
    const r = await patchStudentMockResponse(params);
    return { ok: true, student: new Student(r.student) };
  }
  const { data } = await axiosInstance.patch('/profile', params);
  const { ok, student } = data as PatchStudentResponse;
  return { ok, student: new Student(student) };
}

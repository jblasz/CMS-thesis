import { config } from '../../config';
import { IApiPostResponse, GetStudentResponse, IGetStudentsResponse } from '../../interfaces/api';
import { Student } from '../../interfaces/student';
import { deleteStudentMockResponse, getStudentMockResponse, getStudentsMockResponse } from '../mocks/in-memory-student-mocks';
import { axiosInstance } from './request.service';

/**
 * /students GET
 */
export async function getStudents(byCourseId?: string): Promise<IGetStudentsResponse> {
  if (config.useMocks) {
    const { students } = await getStudentsMockResponse(byCourseId);
    return { students: students.map((x) => new Student(x)) };
  }
  const { data } = await axiosInstance.get('/students');
  const { students } = data as IGetStudentsResponse;
  return { students: students.map((x) => new Student(x)) };
}

/**
 * /students/:id GET
 */
export async function getStudent(id: string): Promise<GetStudentResponse> {
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
 * /students/:id DELETE
 */
export async function deleteStudent(id: string): Promise<IApiPostResponse> {
  if (config.useMocks) {
    return deleteStudentMockResponse(id);
  }
  const { data } = await axiosInstance.delete(`/students/${id}`);
  const { ok } = data as IApiPostResponse;
  return { ok };
}

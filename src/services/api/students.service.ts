import { ApiPostResponse, GetStudentResponse, GetStudentsResponse } from '../../interfaces/api';
import { deleteStudentMockResponse, getStudentMockResponse, getStudentsMockResponse } from '../mocks/in-memory-student-mocks';

/**
 * /students GET
 */
export async function getStudents(): Promise<GetStudentsResponse> {
  return getStudentsMockResponse();
}

/**
 * /students/:id GET
 */
export async function getStudent(id: string): Promise<GetStudentResponse> {
  return getStudentMockResponse(id);
}

/**
 * /students/:id GET
 */
export async function deleteStudent(id: string): Promise<ApiPostResponse> {
  return deleteStudentMockResponse(id);
}

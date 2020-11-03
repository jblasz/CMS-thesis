import { ApiPostResponse, GetStudentResponse, GetStudentsResponse } from '../../interfaces/api';
import { Student } from '../../interfaces/student';
import { deleteStudentMockResponse, getStudentMockResponse, getStudentsMockResponse } from '../mocks/in-memory-student-mocks';

/**
 * /students GET
 */
export async function getStudents(byCourseId?: string): Promise<GetStudentsResponse> {
  const { students } = await getStudentsMockResponse(byCourseId);
  return { students: students.map((x) => new Student(x)) };
}

/**
 * /students/:id GET
 */
export async function getStudent(id: string): Promise<GetStudentResponse> {
  const r = await getStudentMockResponse(id);
  return { ...r, student: new Student(r.student) };
}

/**
 * /students/:id DELETE
 */
export async function deleteStudent(id: string): Promise<ApiPostResponse> {
  return deleteStudentMockResponse(id);
}

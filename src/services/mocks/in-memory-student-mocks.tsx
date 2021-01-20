import {
  GetStudentResponse, IGetUserResponse, IPostUserResponse, PatchStudentResponse,
} from '../../interfaces/api';
import {
  getAttendanceByStudent, getIMStudents, getSubmissionsByStudent, setIMStudents,
} from './in-memory-database';

export async function getUserMockResponse(gid: string): Promise<IGetUserResponse> {
  const students = getIMStudents();
  const s = students.find((x) => x._id === gid);
  if (!s) {
    throw new Error('Student not found');
  }
  return Promise.resolve({
    student: s,
    attends: getAttendanceByStudent(s._id),
    submissions: getSubmissionsByStudent(s._id),
  });
}

export function postUserMockResponse(
  gid: string, email: string, name: string, usosId: string,
): Promise<IPostUserResponse> {
  const students = getIMStudents();
  const s = students.find((x) => x._id === gid);
  if (!s) {
    students.push({
      _id: gid,
      contactEmail: email,
      email,
      name,
      usosId,
      registeredAt: new Date(),
    });
    setIMStudents(students);
  }
  return getUserMockResponse(gid);
}

export function getStudentMockResponse(studentID: string): Promise<GetStudentResponse> {
  return getUserMockResponse(studentID);
}

export function patchStudentMockResponse(params: {
  studentID: string
  name?: string
  email?: string
  contactEmail?: string
  usosId?: string
}): Promise<PatchStudentResponse> {
  const { studentID, ...rest } = params;
  const student = getIMStudents().find((x) => x._id === studentID);
  if (!student) {
    throw new Error('404');
  }
  Object.keys(rest).forEach((key) => {
    if (key === 'name') {
      student.name = rest.name as string;
    } else if (key === 'email') {
      student.email = rest.email as string;
    } else if (key === 'contactEmail') {
      student.contactEmail = rest.contactEmail as string;
    } else if (key === 'usosId') {
      student.usosId = rest.usosId as string;
    }
  });
  return Promise.resolve({
    ok: true,
    student,
  });
}

export function getStudentsMockResponse(byCourseId?: string) {
  const students = byCourseId ? getIMStudents().filter((s) => {
    const a = getAttendanceByStudent(s._id);
    return a.find((x) => x.courseId === byCourseId);
  }) : getIMStudents();
  return Promise.resolve({ students });
}

export function deleteStudentMockResponse(id: string) {
  const students = getIMStudents();
  const f = students.findIndex((x) => x._id === id);
  if (f > -1) {
    students.splice(f, 1);
    setIMStudents(students);
    return Promise.resolve({ ok: true });
  }
  return Promise.reject(new Error('Student of this id not found'));
}

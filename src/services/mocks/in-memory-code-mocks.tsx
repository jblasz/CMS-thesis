import { v4 } from 'uuid';
import {
  IApiPostResponse,
  IGetCodesResponse, IPostCodeNewResponse, IPostCodeResponse, PostCodeResponseType,
} from '../../interfaces/api';
import { ICode } from '../../interfaces/code';
import {
  getIMCodes, getIMCourses, getIMStudents, setIMCodes,
} from './in-memory-database';

export async function postCodeMockResponse(
  studentID: string, code: string,
): Promise<IPostCodeResponse> {
  const c = getIMCodes().find((x) => x._id === code);
  if (c) {
    if (c.validThrough.valueOf() >= new Date().valueOf()) {
      const course = getIMCourses().find((x) => x._id === c.for.courseId);
      const group = course && course.groups.find((x) => x._id === c.for.groupId);
      const student = getIMStudents().find((x) => x._id === studentID);
      if (!course || !group || !student) {
        throw new Error('Bad code, course student or group not found');
      }
      group.students.push({
        _id: student._id,
        contactEmail: student.contactEmail || '',
        email: student.email || '',
        name: student.name || '',
        usosID: student.usosID || '',
      });
      return Promise.resolve({
        ok: true,
        type: PostCodeResponseType.COURSE_SIGNUP,
        courseSignup: c.for,
      });
    }
  }
  throw new Error('404 not found');
}

export async function getCodesMockResponse(
  grabInactive = false, courseId?: string,
): Promise<IGetCodesResponse> {
  const f1 = courseId ? getIMCodes().filter((x) => x.for.courseId === courseId) : getIMCodes();
  const f2 = grabInactive ? f1 : f1.filter((x) => x.valid);
  console.log(getIMCodes(), f1, f2);
  return Promise.resolve({
    codes: f2,
  });
}

export async function postCodeNewMockResponse(
  groupId: string,
  validThrough: Date,
): Promise<IPostCodeNewResponse> {
  const course = getIMCourses().find((x) => x.groups.map((y) => y._id).includes(groupId));
  if (!course) {
    throw new Error('404 not found');
  }
  const group = course.groups.find((x) => x._id === groupId);
  if (!group) {
    throw new Error('404 not found');
  }
  const code: ICode = {
    _id: v4(),
    for: {
      active: course.active,
      courseId: course._id,
      courseName: course.name,
      groupId: group._id,
      groupName: group.name,
    },
    usedBy: [],
    valid: true,
    validThrough,
  };
  setIMCodes([...getIMCodes(), code]);
  return Promise.resolve({
    code,
  });
}

export async function deleteCodeMockResponse(code: string): Promise<IApiPostResponse> {
  const c = getIMCodes();
  const i = c.findIndex((x) => x._id === code);
  if (i < 0) {
    throw new Error('404 not found');
  }
  c.splice(i, 1);
  setIMCodes(c);
  return {
    ok: true,
  };
}

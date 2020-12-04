import { Student } from './student';

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student'
}

export interface IUser {
  role: Role
  student: Student
}

export function User(u?: IUser): IUser {
  return {
    role: Role.STUDENT,
    student: new Student(),
    ...u,
  };
}

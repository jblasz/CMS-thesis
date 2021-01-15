import { ICourseGroupMeta } from './misc';
import { Student } from './student';

export interface ICode {
  _id: string
  validThrough: Date
  valid: boolean
  usedBy: Student[]
  for: ICourseGroupMeta
}

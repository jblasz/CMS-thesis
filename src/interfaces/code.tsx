import { Student } from './student';

export interface Code {
  _id: string
  validThrough: Date
  valid: boolean
  usedBy: Student[]
}

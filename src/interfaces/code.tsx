import { ICourseGroupMeta, NormalizeCourseGroupMeta } from './misc';
import { Student } from './student';

export interface ICode {
  _id: string
  validThrough: Date
  valid: boolean
  usedBy: Student[]
  for: ICourseGroupMeta
}

export function NormalizeCode(o?: ICode): ICode {
  if (o) {
    return {
      _id: o._id || '',
      for: NormalizeCourseGroupMeta(o.for),
      usedBy: o.usedBy,
      valid: !!o.valid,
      validThrough: new Date(o.validThrough || 0),
    };
  }
  return {
    _id: '',
    for: NormalizeCourseGroupMeta(),
    usedBy: [],
    valid: false,
    validThrough: new Date(0),
  };
}

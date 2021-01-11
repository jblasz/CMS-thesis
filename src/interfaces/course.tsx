import joi from 'joi';
import { v4 } from 'uuid';
import { CourseLaboratory, ICourseLaboratory, ILaboratoryStub } from './courseLaboratory';
import { ICourseGroup, CourseGroup, IGroupStub } from './courseGroup';
import { Validable, ValResult } from './misc';

export enum CourseLanguage {
  EN = 'en',
  PL = 'pl'
}

export interface ICourseStub {
  _id: string
  name: string
  language: CourseLanguage
  semester: string
  active: boolean
  description: string
  descriptionShort: string
  groups: IGroupStub[]
  laboratories: ILaboratoryStub[]
}

export interface ICourse extends ICourseStub {
  laboratories: ICourseLaboratory[]
  groups: ICourseGroup[]
  shown: boolean
}

export class Course implements ICourse, Validable {
  _id = v4();

  name = v4();

  description = ''

  descriptionShort = ''

  language: CourseLanguage = CourseLanguage.EN

  semester = 'F'

  laboratories: CourseLaboratory[] = []

  groups: CourseGroup[] = []

  active = true

  shown = true

  constructor(o?: ICourse | string | ICourseStub) {
    if (typeof o === 'string') {
      this._id = o;
    } else if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
      this.descriptionShort = o.descriptionShort || '';
      this.language = o.language || 'en';
      this.semester = o.semester || '';
      this.active = !!o.active;
      const oo = o as ICourse;
      this.shown = !!oo.shown;
      if (oo.laboratories && oo.laboratories.length) {
        this.laboratories = oo.laboratories.map((lab) => new CourseLaboratory(lab));
      }
      if (oo.groups && oo.groups.length) {
        this.groups = oo.groups.map((group) => new CourseGroup(group));
      }
    }
  }

  validate(): ValResult {
    const { error } = joi.object().keys({
      _id: joi.string().optional(),
      name: joi.string().required(),
      description: joi.string().required(),
      descriptionShort: joi.string().required(),
      language: joi.string().allow('en', 'pl').required(),
      semester: joi.string().required(),
    }).validate({
      _id: this._id,
      name: this.name,
      description: this.description,
      descriptionShort: this.descriptionShort,
      language: this.language,
      semester: this.semester,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    const fail = this.laboratories
      .map((lab) => ({ ...lab.validate(), _id: lab._id }))
      .find((x) => !x.ok);
    if (fail) {
      return { ok: false, error: `Lab ${fail._id} error - ${fail.error}` };
    }
    const fail2 = this.groups
      .map((group) => ({ ...group.validate(), _id: group._id }))
      .find((x) => !x.ok);
    if (fail2) {
      return { ok: false, error: `Group ${fail2._id} error - ${fail2.error}` };
    }
    // ensure each lab has a task for each group
    const gids = this.groups.map((x) => x._id);
    for (const lab of this.laboratories) {
      const gidsWithTasks = Object.keys(lab.tasks);
      const unmatched = gids.find((gid) => !gidsWithTasks.includes(gid));
      if (unmatched) {
        return { ok: false, error: `Lab ${lab._id} has no task defined for group ${unmatched}` };
      }
      if (gids.length !== Object.keys(lab.tasks).length) {
        return { ok: false, error: `Lab ${lab._id} has a task for a nonexistent group defined` };
      }
    }
    return { ok: true, json: JSON.stringify(this) };
  }
}

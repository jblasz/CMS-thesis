import joi from 'joi';
import { IResourceLink } from './resourceLink';
import { CourseLaboratory, ICourseLaboratory } from './courseLaboratory';
import { ICourseGroup, CourseGroup } from './courseGroup';
import { Validable, ValResult } from './misc';

export enum CourseLanguage {
  EN = 'en',
  PL = 'pl'
}

export interface ICourse {
  _id: string
  name: string
  description: string
  language: CourseLanguage
  semester: string
  links: IResourceLink[]
  laboratories: ICourseLaboratory[]
  groups: ICourseGroup[]
  active: boolean
  shown: boolean
}

export class Course implements ICourse, Validable {
  _id = ''

  name = ''

  description = ''

  language: CourseLanguage = CourseLanguage.EN

  semester = ''

  links: IResourceLink[] = []

  laboratories: CourseLaboratory[] = []

  groups: CourseGroup[] = []

  active = true

  shown = true

  constructor(o?: ICourse) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
      this.language = o.language || 'en';
      this.semester = o.semester || '';
      this.links = o.links || [];
      this.active = !!o.active;
      this.shown = !!o.shown;
      if (o.laboratories && o.laboratories.length) {
        this.laboratories = o.laboratories.map((lab) => new CourseLaboratory(lab));
      }
      if (o.groups && o.groups.length) {
        this.groups = o.groups.map((group) => new CourseGroup(group));
      }
    }
  }

  validate(): ValResult {
    const { error } = joi.object().keys({
      _id: joi.string().optional(),
      name: joi.string().required(),
      description: joi.string().required(),
      language: joi.string().allow('en', 'pl').required(),
      semester: joi.string().required(),
      links: joi.array().items(joi.object().keys({
        description: joi.string().required(),
        link: joi.string().required(),
      })),
    }).validate({
      _id: this._id,
      name: this.name,
      description: this.description,
      language: this.language,
      semester: this.semester,
      links: this.links,
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

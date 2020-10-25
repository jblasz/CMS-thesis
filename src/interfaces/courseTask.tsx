import joi from 'joi';
import { Validable, ValResult } from './misc';

export interface ICourseTask {
  _id: string
  description: string
  dateFrom?: Date
  dateTo?: Date
  gracePeriod: number
  resourceId?: string
  forLabName?: string
  forLabId?: string
}

export class CourseTask implements ICourseTask, Validable {
  _id = ''

  description = ''

  dateFrom?: Date

  dateTo?: Date

  gracePeriod = 0

  resourceId?: string

  forLabName?: string

  forLabId?: string

  constructor(o?: ICourseTask) {
    if (o) {
      this._id = o._id || '';
      this.description = o.description || '';
      this.resourceId = o.resourceId || '';
      this.forLabId = o.forLabId || '';
      this.forLabName = o.forLabName || '';
      if (o.dateFrom) { this.dateFrom = new Date(o.dateFrom); }
      if (o.dateTo) { this.dateTo = new Date(o.dateTo); }
    }
  }

  validate(): ValResult {
    const {
      _id, description, dateFrom, dateTo, gracePeriod, resourceId,
    } = this;
    const { error } = joi.object().keys({
      _id: joi.string().optional(),
      description: joi.string().required(),
      dateFrom: joi.date().required(),
      dateTo: joi.date().required(),
      gracePeriod: joi.number().min(0).required(),
      resourceId: joi.string().required(),
    }).validate({
      _id, description, dateFrom, dateTo, gracePeriod, resourceId,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, json: JSON.stringify(this) };
  }
}

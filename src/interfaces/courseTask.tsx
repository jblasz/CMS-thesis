export interface ICourseTask {
  _id: string
  description: string
  dateFrom?: Date
  dateTo?: Date
  gracePeriod: number
}

export class CourseTask implements ICourseTask {
  _id = ''

  description = ''

  dateFrom?: Date

  dateTo?: Date

  gracePeriod = 0

  resourceId?: string

  constructor(o?: ICourseTask) {
    if (o) {
      this._id = o._id || '';
      this.description = o.description || '';
      if (o.dateFrom) { this.dateFrom = new Date(o.dateFrom); }
      if (o.dateTo) { this.dateTo = new Date(o.dateTo); }
    }
  }
}

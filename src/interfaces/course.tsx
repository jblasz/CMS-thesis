export interface ICourse {
  _id: string
  name: string
  description: string
}

export class Course implements ICourse {
  _id = ''

  name = ''

  description = ''

  constructor(o?: ICourse) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
    }
  }
}

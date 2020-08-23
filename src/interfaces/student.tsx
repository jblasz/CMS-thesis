export interface IStudent {
  _id: string
  name?: string
  email?: string
  usosId?: string
}

export class Student implements IStudent {
  _id = ''

  name?: string

  email?: string

  usosId?: string

  constructor(o?: IStudent) {
    if (o) {
      this._id = o._id || '';
      this.email = o.email || '';
      this.name = o.name || '';
      this.usosId = o.usosId || '';
    }
  }
}

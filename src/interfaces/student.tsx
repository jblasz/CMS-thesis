export interface IStudent {
  _id: string
  registeredAt?: Date
  name: string
  email?: string
  usosId?: string
}

export class Student implements IStudent {
  _id = ''

  name = ''

  email?: string

  usosId?: string

  registeredAt?: Date

  constructor(o?: IStudent) {
    if (o) {
      this._id = o._id || '';
      this.email = o.email || '';
      this.name = o.name || '';
      this.usosId = o.usosId || '';
      this.registeredAt = (o.registeredAt && new Date(o.registeredAt)) || new Date(0);
    }
  }
}

export interface IStudent {
  _id: string
  name: string
  fullname?: string
  email: string
  contactEmail: string
  usosId: string
  registeredAt?: Date
}

export class Student implements IStudent {
  _id = ''

  name = ''

  email = ''

  usosId = ''

  contactEmail = ''

  registeredAt?: Date

  constructor(o?: IStudent | string) {
    if (typeof o === 'string') {
      this._id = o;
    } else if (o) {
      this._id = o._id || '';
      this.email = o.email || '';
      this.contactEmail = o.contactEmail || '';
      this.name = o.name || o.fullname || '';
      this.usosId = o.usosId || '';
      this.registeredAt = (o.registeredAt && new Date(o.registeredAt)) || new Date(0);
    }
  }
}

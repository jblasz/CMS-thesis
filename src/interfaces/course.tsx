export interface ICourse {
  _id: string
  name: string
  description: string
  language: 'en' | 'pl'
}

export class Course implements ICourse {
  _id = ''

  name = ''

  description = ''

  language: 'en' | 'pl' = 'en'

  constructor(o?: ICourse) {
    if (o) {
      this._id = o._id || '';
      this.name = o.name || '';
      this.description = o.description || '';
      this.language = o.language || 'en';
    }
  }
}

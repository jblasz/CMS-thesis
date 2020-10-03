export interface ResourceMeta {
  _id: string
  name: string
}

export interface Resource extends ResourceMeta {
  resource: ArrayBuffer
}

export interface Submission extends Resource {
  courseID: string
  labID: string
  submittedAt: Date
  note: string
}

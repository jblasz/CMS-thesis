export interface UsedBy {
  courseId: string
  courseName: string
  labId: string
  labName: string
}

export interface ResourceMeta {
  _id: string
  name: string
  usedBy?: UsedBy[]
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

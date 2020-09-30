export interface Resource {
  _id: string
  resource: ArrayBuffer
}

export interface Submission extends Resource {
  courseID: string
  labID: string
  submittedAt: Date
  note: string
}

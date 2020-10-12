export interface ValResult {
  ok: boolean
  error?: string
  json?: string
}

export interface Validable {
  validate: () => ValResult
}

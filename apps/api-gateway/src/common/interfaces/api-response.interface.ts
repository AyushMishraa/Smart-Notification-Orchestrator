export interface ApiErrorDetail {
  field?: string
  message: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
  }
  meta: {
    requestId: string
    timestamp: string
  }
}
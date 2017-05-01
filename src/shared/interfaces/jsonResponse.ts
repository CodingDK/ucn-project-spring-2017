export interface JsonResponse<T> {
  data: T,
  message: string,
  succus: boolean
}
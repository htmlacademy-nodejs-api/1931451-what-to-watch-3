export default class HttpError extends Error {
  constructor(
    public httpStatusCode: number,
    public message: string,
    public details?: string
  ) {
    super(message);
  }
}

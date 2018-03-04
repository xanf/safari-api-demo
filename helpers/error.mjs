export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
    this.status = 404;
    this.expose = true;
  }
}

export class NotAuthorizedError extends Error {
  constructor() {
    super('Not Authorized');
    this.status = 401;
    this.expose = true;
  }
}

export class ValidationError extends Error {}

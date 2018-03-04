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

export class LogicError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.expose = true;
  }
}

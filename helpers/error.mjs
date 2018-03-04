export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
    this.status = 404;
    this.expose = true;
  }
}

export class NotAuthorizedError extends Error {}

export class ValidationError extends Error {}

export default async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      ctx.throw(404, 'Not Found');
    }
    console.log('here');
    ctx.throw(500, 'Unknown');
  }
};

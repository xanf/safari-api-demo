import { NotFoundError } from './error';

export default entity => {
  if (!entity) {
    throw new NotFoundError();
  }
  return entity;
};

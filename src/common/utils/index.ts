import { FunctionType } from '../types/type';

export * from './parser.util';
export * from './math.util';

export const pipe = (...functions: FunctionType[]) => {
  return (initial: unknown) =>
    functions.reduce((result, func) => {
      return func(result);
    }, initial);
};

import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ReqUserPayload } from '../types/type';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (
    property: keyof ReqUserPayload,
    context: ExecutionContext,
  ): ReqUserPayload | ReqUserPayload[keyof ReqUserPayload] => {
    // Get context Request Object
    const request = context.switchToHttp().getRequest<Request>();

    // Expect Request, user property as type 'ReqUserPayload'(Refer to defined in common/types/type.d.ts)
    const user: ReqUserPayload = (request.user ?? {}) as ReqUserPayload;
    return property ? user[property] : user;
  },
);

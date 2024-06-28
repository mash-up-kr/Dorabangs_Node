import { Types } from 'mongoose';

export type JwtPayload = {
  id: string;
};

export type ReqUserPayload = {
  id: Types.ObjectId;
};

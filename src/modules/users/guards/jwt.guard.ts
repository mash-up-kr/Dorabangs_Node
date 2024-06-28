import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JWT_STRATEGY_TOKEN } from './strategy/strategy.token';

@Injectable()
export class JwtGuard extends AuthGuard(JWT_STRATEGY_TOKEN) {
  constructor(private readonly reflector: Reflector) {
    super();
  }
}

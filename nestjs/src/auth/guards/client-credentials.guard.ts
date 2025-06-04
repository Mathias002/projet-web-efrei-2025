import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClientCredentialsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.getArgByIndex(2); // For GraphQL
    const req: Request = ctx.req;

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.decode(token);

      // Vérifie que le token vient de Auth0 et a le bon audience
      if (
        decoded.iss !== 'https://dev-r4bru11fep1yxnkg.us.auth0.com/' ||
        decoded.aud !== 'https://messaging-api' ||
        decoded.gty !== 'client-credentials'
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

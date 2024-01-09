import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable } from '@nestjs/common';

export const JwtSecretTMP = 'secretKey43';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JwtSecretTMP,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'cashamole_user_token' in req.cookies &&
      req.cookies.cashamole_user_token.length > 0
    ) {
      return req.cookies.cashamole_user_token;
    }
    return null;
  }

  async validate(payload: any) {
    return { userId: payload.id };
  }
}
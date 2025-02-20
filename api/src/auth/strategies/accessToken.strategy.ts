import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'

type JwtPayload = {
  sub: string
  username: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: <string>process.env.JWT_ACCESS_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    console.log('pay', payload)
    return payload
  }
}

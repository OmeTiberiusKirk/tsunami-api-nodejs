import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest<JwtPayload>(err: any, user: JwtPayload) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from './roles.enum'
import { ROLES_KEY } from './roles.decorator'
import { JwtPayload } from 'src/auth/auth.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRole) {
      return true
    }

    const req = context.switchToHttp().getRequest<{ user: JwtPayload }>()
    return requiredRole == req.user.role
  }
}

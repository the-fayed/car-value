import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../interfaces/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RoleGuard),
  )
}
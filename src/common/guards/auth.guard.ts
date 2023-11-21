import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.userRepo.findOne({ where: { id: payload.sub.id } });
    if (!user) return false;
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

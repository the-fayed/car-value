import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const {userId} = request.session;
    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }
    return handler.handle();
  }
}

import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  response: {
    access_token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

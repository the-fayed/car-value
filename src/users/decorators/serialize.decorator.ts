import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../..//common/interceptors/serialize.interceptor';
import { ClassConstructor } from '../../common/interfaces/classConstructor.interface';

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

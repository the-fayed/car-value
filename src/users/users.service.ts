import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, name: string, password: string) {
    const user = this.repo.create({
      email: email,
      name: name,
      password: password,
    });

    return this.repo.save(user);
  }

  find() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`No user found with the id ${id}`);
    }
    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`No user found with the id ${id}`);
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`No user found with the id ${id}`);
    }

    return this.repo.remove(user);
  }
}

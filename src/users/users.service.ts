import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/common/interfaces/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, password: string, name: string, role: Role[]) {
    const user = this.repo.create({
      email,
      password,
      name,
      role,
    });

    return this.repo.save(user);
  }

  signup(email: string, password: string, name: string) {
    const user = this.repo.create({
      email,
      password,
      name,
    });

    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email: email } });
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    if (!id) {
      id = undefined;
    }
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

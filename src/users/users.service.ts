import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
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

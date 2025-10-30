import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: Partial<User>): Promise<User> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      // relations: {
      //   refreshToken: true,
      // },
    });
  }

  async update(dto: Partial<User>): Promise<User> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}

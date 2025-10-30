import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { RefreshToken } from "./refresh-token.entity";

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async create(dto: Partial<RefreshToken>): Promise<RefreshToken> {
    const entity = this.repository.create(dto);

    return this.repository.save(entity);
  }

  async update(dto: Partial<RefreshToken>): Promise<RefreshToken> {
    const entity = this.repository.create(dto);

    return this.repository.save(entity);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }

  findById(id: string): Promise<RefreshToken | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}

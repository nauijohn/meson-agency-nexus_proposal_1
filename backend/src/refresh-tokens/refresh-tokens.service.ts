import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateRefreshTokenDto } from "./dto/create-refresh-token.dto";
import { UpdateRefreshTokenDto } from "./dto/update-refresh-token.dto";
import { RefreshToken } from "./entities/refresh-token.entity";

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const entity = this.mapper.map(dto, CreateRefreshTokenDto, RefreshToken);
    return this.repository.save(entity);
  }

  async update(
    entity: RefreshToken,
    dto: UpdateRefreshTokenDto,
  ): Promise<RefreshToken> {
    this.mapper.mutate(dto, entity, UpdateRefreshTokenDto, RefreshToken);
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

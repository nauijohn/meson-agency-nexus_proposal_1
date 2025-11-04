import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateRefreshTokenDto } from "./dto/update-refresh-token.dto";
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

  async update(
    entity: RefreshToken,
    dto: UpdateRefreshTokenDto,
  ): Promise<RefreshToken> {
    Object.assign(entity, dto);
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

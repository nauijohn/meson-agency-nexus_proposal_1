import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import {
  JwtRefreshUser,
  RefreshTokenStrategy,
} from "../refresh-token.strategy";

describe("RefreshTokenStrategy", () => {
  let refreshTokenStrategy: RefreshTokenStrategy;

  beforeAll(async () => {
    process.env.JWT_REFRESH_TOKEN_SECRET = "test_refresh_secret";
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenStrategy, ConfigService],
    }).compile();

    refreshTokenStrategy =
      module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validate", () => {
    const testFunc = (payload: {
      email: string;
      tokenId: string;
      sub: string;
      exp: number;
      iat: number;
    }) => refreshTokenStrategy.validate(payload);

    const payload = {
      email: "test@example.com",
      tokenId: "tokenId",
      sub: "1",
      exp: 1234567890,
      iat: 1234567890,
    };

    const mockUser: JwtRefreshUser = {
      id: payload.sub,
      email: payload.email,
      tokenId: payload.tokenId,
    };

    test("success", () => {
      expect(testFunc(payload)).toEqual(mockUser);
    });

    test("no payload received -> throws UnauthorizedException", () => {
      expect(() => testFunc(null as any)).toThrow(UnauthorizedException);
    });
  });
});

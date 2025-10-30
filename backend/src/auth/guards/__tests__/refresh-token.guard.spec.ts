import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { JwtUser } from "../../strategies";
import { RefreshTokenGuard } from "../refresh-token.guard";

describe("RefreshTokenGuard", () => {
  let refreshTokenGuard: RefreshTokenGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenGuard],
    }).compile();

    refreshTokenGuard = module.get<RefreshTokenGuard>(RefreshTokenGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(refreshTokenGuard).toBeDefined();
  });

  const refreshTokenGuardSpy: Record<string, jest.SpyInstance> = {};

  describe("canActivate", () => {
    beforeEach(() => {
      refreshTokenGuardSpy.canActivate = jest
        .spyOn(
          Object.getPrototypeOf(RefreshTokenGuard.prototype),
          "canActivate",
        )
        .mockResolvedValue(true);
    });

    it("returns true", async () => {
      await expect(
        refreshTokenGuard.canActivate({} as ExecutionContext),
      ).resolves.toBe(true);

      expect(refreshTokenGuardSpy.canActivate).toHaveBeenCalled();
    });

    it("returns false", async () => {
      refreshTokenGuardSpy.canActivate.mockResolvedValue(false);

      await expect(
        refreshTokenGuard.canActivate({} as ExecutionContext),
      ).resolves.toBe(false);

      expect(refreshTokenGuardSpy.canActivate).toHaveBeenCalled();
    });

    it("throws error", async () => {
      refreshTokenGuardSpy.canActivate.mockRejectedValue(new Error());

      await expect(
        refreshTokenGuard.canActivate({} as ExecutionContext),
      ).rejects.toThrow();

      expect(refreshTokenGuardSpy.canActivate).toHaveBeenCalled();
    });
  });

  describe("handleRequest", () => {
    let user: JwtUser;

    beforeEach(() => {
      user = {
        id: "1",
        email: "test@example.com",
      };
    });

    test("there is user", () => {
      expect(
        refreshTokenGuard.handleRequest(
          null as any,
          user,
          null as any,
          {} as ExecutionContext,
          {} as any,
        ),
      ).toBe(user);
    });

    test("there is no user", () => {
      expect(() =>
        refreshTokenGuard.handleRequest(
          null as any,
          null as any,
          null as any,
          {} as ExecutionContext,
        ),
      ).toThrow(TokenExpiredError);
    });

    test("there is an err", () => {
      expect(() =>
        refreshTokenGuard.handleRequest(
          {} as any,
          user,
          null as any,
          {} as ExecutionContext,
        ),
      ).toThrow();
    });

    test("there is an info as JsonWebTokenError", () => {
      expect(
        refreshTokenGuard.handleRequest(
          null as any,
          user,
          { someinfo: "info" } as any,
          {} as ExecutionContext,
          {} as any,
        ),
      ).toBe(user);
    });

    test("there is an info as JsonWebTokenError", () => {
      expect(() =>
        refreshTokenGuard.handleRequest(
          null as any,
          user,
          new JsonWebTokenError("JWT Error"),
          {} as ExecutionContext,
          {} as any,
        ),
      ).toThrow(JsonWebTokenError);
    });
  });
});

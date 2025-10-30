import { InternalServerErrorException } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Test, TestingModule } from "@nestjs/testing";

import { User } from "../../../users";
import { LocalAuthGuard } from "../local-auth.guard";

describe("LocalAuthGuard", () => {
  let localAuthGuard: LocalAuthGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    localAuthGuard = module.get<LocalAuthGuard>(LocalAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(localAuthGuard).toBeDefined();
  });

  const localAuthGuardSpy: Record<string, jest.SpyInstance> = {};

  describe("canActivate", () => {
    beforeEach(() => {
      localAuthGuardSpy.canActivate = jest
        .spyOn(Object.getPrototypeOf(LocalAuthGuard.prototype), "canActivate")
        .mockResolvedValue(true);
    });

    it("returns true", async () => {
      await expect(
        localAuthGuard.canActivate({} as ExecutionContext),
      ).resolves.toBe(true);

      expect(localAuthGuardSpy.canActivate).toHaveBeenCalled();
    });

    it("returns false", async () => {
      localAuthGuardSpy.canActivate.mockResolvedValue(false);

      await expect(
        localAuthGuard.canActivate({} as ExecutionContext),
      ).resolves.toBe(false);

      expect(localAuthGuardSpy.canActivate).toHaveBeenCalled();
    });

    it("throws error", async () => {
      localAuthGuardSpy.canActivate.mockRejectedValue(new Error());

      await expect(
        localAuthGuard.canActivate({} as ExecutionContext),
      ).rejects.toThrow();

      expect(localAuthGuardSpy.canActivate).toHaveBeenCalled();
    });
  });

  describe("handleRequest", () => {
    let user: User;

    beforeEach(() => {
      user = {
        id: "1",
        email: "test@example.com",
        password: "hashedpassword",
        refreshToken: undefined,
      };
    });

    test("there is user", () => {
      expect(
        localAuthGuard.handleRequest(
          null as any,
          user,
          null as any,
          {} as ExecutionContext,
        ),
      ).toBe(user);
    });

    test("there is no user", () => {
      expect(() =>
        localAuthGuard.handleRequest(
          null as any,
          null as any,
          null as any,
          {} as ExecutionContext,
        ),
      ).toThrow(InternalServerErrorException);
    });

    test("there is an err", () => {
      expect(() =>
        localAuthGuard.handleRequest(
          {} as any,
          user,
          null as any,
          {} as ExecutionContext,
        ),
      ).toThrow();
    });
  });
});

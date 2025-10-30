import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { User } from "../../../users";
import { AuthService } from "../../auth.service";
import { hash } from "../../utils/security";
import { LocalStrategy } from "../local.strategy";

describe("LocalStrategy", () => {
  let localStrategy: LocalStrategy;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue({
        validateUser: jest.fn(),
      })
      .compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validate", () => {
    const testFunc = (email: string, password: string) =>
      localStrategy.validate(email, password);

    const email = "test@example.com";
    const password = "test123";

    const authServiceSpy: Record<string, jest.SpyInstance> = {};

    let mockUser: User;

    beforeEach(async () => {
      mockUser = {
        id: "1",
        email,
        password: await hash(password),
        refreshToken: undefined,
      };

      authServiceSpy["validateUser"] = jest
        .spyOn(localStrategy["authService"], "validateUser")
        .mockResolvedValue(mockUser);
    });

    test("success", async () => {
      await expect(testFunc(email, password)).resolves.toEqual(mockUser);
      expect(authServiceSpy["validateUser"]).toHaveBeenCalled();
    });

    describe("Dependencies: ", () => {
      describe("authServiceSpy['validateUser']", () => {
        test("returns null -> throws UnauthorizedException", async () => {
          authServiceSpy["validateUser"].mockResolvedValue(null);
          await expect(testFunc(email, password)).rejects.toThrow(
            UnauthorizedException,
          );

          expect(authServiceSpy["validateUser"]).toHaveBeenCalled();
        });

        test("returns undefined -> throws UnauthorizedException", async () => {
          authServiceSpy["validateUser"].mockResolvedValue(undefined);
          await expect(testFunc(email, password)).rejects.toThrow(
            UnauthorizedException,
          );
          expect(authServiceSpy["validateUser"]).toHaveBeenCalled();
        });

        test("throws error -> throws UnauthorizedException", async () => {
          const error = new Error("Test error");
          authServiceSpy["validateUser"].mockRejectedValue(error);
          await expect(testFunc(email, password)).rejects.toThrow(error);
          expect(authServiceSpy["validateUser"]).toHaveBeenCalled();
        });
      });
    });
  });
});

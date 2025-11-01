import {
  InternalServerErrorException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { RefreshTokensService } from "../../refresh-tokens/index.ts";
import { User, UsersService } from "../../users/index.ts/index.js";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { SignUpDto } from "../dto";
import { JwtRefreshUser } from "../strategies/refresh-token.strategy";

describe("Auth Controller", () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, RefreshTokensService],
    })
      .overrideProvider(AuthService)
      .useValue({
        createTokens: jest.fn(),
        refreshTokens: jest.fn(),
      })
      .overrideProvider(UsersService)
      .useValue({
        findByEmail: jest.fn(),
        create: jest.fn(),
      })
      .overrideProvider(RefreshTokensService)
      .useValue({
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    const testFunc = (arg: SignUpDto) => controller.signUp(arg);
    const dto: SignUpDto = {
      email: "test@example.com",
      password: "password",
    };

    const authServiceSpy: Record<string, jest.SpyInstance> = {};
    const refreshTokensServiceSpy: Record<string, jest.SpyInstance> = {};
    const usersServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(() => {
      usersServiceSpy["findByEmail"] = jest
        .spyOn(controller["usersService"], "findByEmail")
        .mockResolvedValue(null);

      usersServiceSpy["create"] = jest
        .spyOn(controller["usersService"], "create")
        .mockResolvedValue({
          id: "1",
          email: dto.email,
          password: dto.password,
          refreshToken: undefined,
        });

      authServiceSpy["createTokens"] = jest
        .spyOn(controller["authService"], "createTokens")
        .mockReturnValue({
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });

      refreshTokensServiceSpy["create"] = jest
        .spyOn(controller["refreshTokensService"], "create")
        .mockResolvedValue({
          id: "1",
          user: undefined,
          token: "refreshToken",
        });
    });

    test("success", async () => {
      await expect(testFunc(dto)).resolves.toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
      expect(usersServiceSpy["create"]).toHaveBeenCalled();
      expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
      expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
    });

    describe("Expects error when", () => {
      describe("Dependencies: ", () => {
        describe("usersService['findByEmail']", () => {
          test("returns user", async () => {
            usersServiceSpy["findByEmail"].mockResolvedValue({
              id: "1",
              email: dto.email,
              password: dto.password,
              refreshToken: undefined,
            });

            await expect(testFunc(dto)).rejects.toThrow(
              UnprocessableEntityException,
            );

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).not.toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });

          test("throws error", async () => {
            usersServiceSpy["findByEmail"].mockRejectedValue(new Error());

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).not.toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });
        });

        describe("usersService['create']", () => {
          test("returns null", async () => {
            usersServiceSpy["create"].mockResolvedValueOnce(null as any);

            await expect(testFunc(dto)).rejects.toThrow(
              InternalServerErrorException,
            );

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            usersServiceSpy["create"].mockResolvedValueOnce(undefined as any);

            await expect(testFunc(dto)).rejects.toThrow(
              InternalServerErrorException,
            );

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });

          test("throws error", async () => {
            usersServiceSpy["create"].mockRejectedValue(new Error());

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });
        });

        describe("authService['createTokens']", () => {
          test("returns null", async () => {
            authServiceSpy["createTokens"].mockReturnValue(null as any);

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            authServiceSpy["createTokens"].mockReturnValue(undefined as any);

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
          });
        });

        describe("refreshTokensService['create']", () => {
          test("returns null", async () => {
            refreshTokensServiceSpy["create"].mockResolvedValue(null as any);

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            refreshTokensServiceSpy["create"].mockResolvedValue(
              undefined as any,
            );

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
          });

          test("throws error", async () => {
            refreshTokensServiceSpy["create"].mockRejectedValue(new Error());

            await expect(testFunc(dto)).rejects.toThrow();

            expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
            expect(usersServiceSpy["create"]).toHaveBeenCalled();
            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("signIn", () => {
    const testFunc = (arg: User) => controller.signIn(arg);
    let user: User;
    const authServiceSpy: Record<string, jest.SpyInstance> = {};
    const refreshTokensServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(() => {
      user = {
        id: "1",
        email: "test@example.com",
        password: "password",
        refreshToken: undefined,
      };

      authServiceSpy["createTokens"] = jest
        .spyOn(controller["authService"], "createTokens")
        .mockReturnValue({
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });

      refreshTokensServiceSpy["create"] = jest
        .spyOn(controller["refreshTokensService"], "create")
        .mockResolvedValue({
          id: "1",
          token: "refreshToken",
          user: undefined,
        });

      refreshTokensServiceSpy["update"] = jest
        .spyOn(controller["refreshTokensService"], "update")
        .mockResolvedValue({
          id: "1",
          token: "updateRefreshToken",
          user: undefined,
        });
    });

    describe("Success", () => {
      test("refreshToken from user is falsy", async () => {
        await expect(testFunc(user)).resolves.toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
        expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
        expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
      });

      test("refreshToken from user is truthy", async () => {
        user.refreshToken = {
          id: "1",
          token: "oldRefreshToken",
          user: undefined,
        };

        await expect(testFunc(user)).resolves.toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
        expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
        expect(refreshTokensServiceSpy["update"]).toHaveBeenCalled();
      });
    });

    describe("Expects error when", () => {
      describe("Dependencies: ", () => {
        describe("authService['createTokens']", () => {
          test("returns null", async () => {
            jest
              .spyOn(controller["authService"], "createTokens")
              .mockReturnValue(null as any);

            await expect(testFunc(user)).rejects.toThrow();

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            authServiceSpy["createTokens"].mockReturnValue(undefined as any);

            await expect(testFunc(user)).rejects.toThrow();

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
          });
        });

        describe("refreshTokensService['create']", () => {
          test("returns null", async () => {
            refreshTokensServiceSpy["create"].mockResolvedValue(null as any);

            await expect(testFunc(user)).rejects.toThrow(
              new InternalServerErrorException(),
            );

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            refreshTokensServiceSpy["create"].mockResolvedValue(
              undefined as any,
            );

            await expect(testFunc(user)).rejects.toThrow(
              new InternalServerErrorException(),
            );

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
          });

          test("throws error", async () => {
            refreshTokensServiceSpy["create"].mockRejectedValue(new Error());

            await expect(testFunc(user)).rejects.toThrow();

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).not.toHaveBeenCalled();
          });
        });

        describe("refreshTokensService['update']", () => {
          test("returns null", async () => {
            refreshTokensServiceSpy["update"].mockResolvedValue(null as any);

            user.refreshToken = {
              id: "1",
              token: "oldRefreshToken",
              user: undefined,
            };

            await expect(testFunc(user)).rejects.toThrow(
              new InternalServerErrorException(),
            );

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            refreshTokensServiceSpy["update"].mockResolvedValue(
              undefined as any,
            );

            user.refreshToken = {
              id: "1",
              token: "oldRefreshToken",
              user: undefined,
            };

            await expect(testFunc(user)).rejects.toThrow(
              new InternalServerErrorException(),
            );

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).toHaveBeenCalled();
          });

          test("throws error", async () => {
            refreshTokensServiceSpy["update"].mockRejectedValue(new Error());

            user.refreshToken = {
              id: "1",
              token: "oldRefreshToken",
              user: undefined,
            };

            await expect(testFunc(user)).rejects.toThrow();

            expect(authServiceSpy["createTokens"]).toHaveBeenCalled();
            expect(refreshTokensServiceSpy["create"]).not.toHaveBeenCalled();
            expect(refreshTokensServiceSpy["update"]).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("refreshToken", () => {
    const testFunc = (arg1: JwtRefreshUser, arg2: string) =>
      controller.refreshToken(arg1, arg2);
    const user: JwtRefreshUser = {
      id: "1",
      email: "test@example.com",
      tokenId: "tokenId",
    };
    const bearerToken = "bearerToken";
    const authServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(() => {
      authServiceSpy["refreshTokens"] = jest
        .spyOn(controller["authService"], "refreshTokens")
        .mockResolvedValue({
          accessToken: "refreshdAccessToken",
          refreshToken: "refreshedRefreshToken",
        });
    });

    test("success", async () => {
      await expect(testFunc(user, bearerToken)).resolves.toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      expect(authServiceSpy["refreshTokens"]).toHaveBeenCalled();
    });

    describe("Expects error when", () => {
      describe("Dependencies: ", () => {
        describe("authService['refreshTokens']", () => {
          test("returns null", async () => {
            authServiceSpy["refreshTokens"].mockResolvedValue(null as any);

            await expect(testFunc(user, bearerToken)).rejects.toThrow();

            expect(authServiceSpy["refreshTokens"]).toHaveBeenCalled();
          });

          test("returns undefined", async () => {
            authServiceSpy["refreshTokens"].mockResolvedValue(undefined as any);

            await expect(testFunc(user, bearerToken)).rejects.toThrow();

            expect(authServiceSpy["refreshTokens"]).toHaveBeenCalled();
          });

          test("throws error", async () => {
            authServiceSpy["refreshTokens"].mockRejectedValue(new Error());

            await expect(testFunc(user, bearerToken)).rejects.toThrow();

            expect(authServiceSpy["refreshTokens"]).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("signOut", () => {
    let user: JwtRefreshUser;

    const testFunc = (arg: JwtRefreshUser) => controller.signOut(arg);

    const refreshTokensServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(() => {
      user = {
        id: "1",
        email: "test@example.com",
        tokenId: "tokenId",
      };

      refreshTokensServiceSpy["delete"] = jest
        .spyOn(controller["refreshTokensService"], "delete")
        .mockResolvedValue();
    });

    describe("Success", () => {
      test("deleted a user", async () => {
        await expect(testFunc(user)).resolves.toBeUndefined();

        expect(refreshTokensServiceSpy["delete"]).toHaveBeenCalled();
      });

      test("user.tokenId is undefined", async () => {
        user.tokenId = undefined as any;
        await expect(testFunc(user)).resolves.toBeUndefined();

        expect(refreshTokensServiceSpy["delete"]).not.toHaveBeenCalled();
      });
    });

    describe("Expects error when", () => {
      describe("Dependencies: ", () => {
        describe("refreshTokensService['delete']", () => {
          test("throws error", async () => {
            jest
              .spyOn(controller["refreshTokensService"], "delete")
              .mockRejectedValue(new Error());

            await expect(testFunc(user)).rejects.toThrow();

            expect(refreshTokensServiceSpy["delete"]).toHaveBeenCalled();
          });
        });
      });
    });
  });
});

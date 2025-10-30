import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { TestCommonModule } from "../../../test/utils/test-common.module";
import { RefreshToken } from "../../refresh-tokens";
import { User, UsersModule, UsersService } from "../../users";
import { AuthService } from "../auth.service";
import { hash } from "../utils/security";

describe("Auth Service", () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestCommonModule.forRoot([User, RefreshToken]),
        UsersModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.getOrThrow("JWT_SECRET"),
              signOptions: {
                expiresIn: configService.getOrThrow("JWT_EXPIRES_IN"),
              },
            };
          },
        }),
      ],
      providers: [AuthService],
    })
      .overrideProvider(UsersService)
      .useValue({
        findByEmail: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    const testFunc = (email: string, password: string) =>
      service.validateUser(email, password);

    const email = "test@example.com";
    const password = "test123";

    const usersServiceSpy: Record<string, jest.SpyInstance> = {};

    let mockUser: User;

    beforeAll(async () => {
      mockUser = {
        id: "1",
        email,
        password: await hash(password),
        refreshToken: undefined,
      };

      usersServiceSpy["findByEmail"] = jest
        .spyOn(service["usersService"], "findByEmail")
        .mockResolvedValue(mockUser);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("success", async () => {
      await expect(testFunc(email, password)).resolves.toEqual(mockUser);

      expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
    });

    test("wrong password", async () => {
      await expect(testFunc(email, "wrongpassword")).resolves.toBeFalsy();

      expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
    });

    describe("Dependencies: ", () => {
      describe("usersService['findByEmail']", () => {
        test("returns null -> expects undefined", async () => {
          usersServiceSpy["findByEmail"].mockResolvedValue(null);
          await expect(testFunc(email, password)).resolves.toBeFalsy();

          expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
        });

        test("returns undefined -> expects undefined", async () => {
          usersServiceSpy["findByEmail"].mockResolvedValue(undefined);
          await expect(testFunc(email, password)).resolves.toBeFalsy();

          expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
        });

        test("throws error -> expects to throw", async () => {
          usersServiceSpy["findByEmail"].mockRejectedValue(new Error());
          await expect(testFunc(email, password)).rejects.toThrow();

          expect(usersServiceSpy["findByEmail"]).toHaveBeenCalled();
        });
      });
    });
  });

  describe("createTokens", () => {
    const testFunc = (user: User) => service.createTokens(user);
    const user: User = {
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      refreshToken: undefined,
    };

    const jwtServiceSpy: Record<string, jest.SpyInstance> = {};
    const configServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(() => {
      jwtServiceSpy["sign"] = jest.spyOn(service["jwtService"], "sign");
      configServiceSpy["get"] = jest.spyOn(service["configService"], "get");
    });

    test("success", () => {
      expect(testFunc(user)).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
      expect(configServiceSpy["get"]).toHaveBeenCalled();
    });

    test("different tokens for users", () => {
      expect(testFunc(user)).not.toEqual(
        testFunc({
          id: "2",
          email: "test2@example.com",
          password: "hashedpassword2",
          refreshToken: undefined,
        }),
      );
      expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
    });
  });

  describe("refreshTokens", () => {
    const testFunc = (userId: string, token: string) =>
      service.refreshTokens(userId, token);

    const userId = "1";
    const token = "sometoken";

    const usersServiceSpy: Record<string, jest.SpyInstance> = {};
    const jwtServiceSpy: Record<string, jest.SpyInstance> = {};

    beforeEach(async () => {
      jwtServiceSpy["sign"] = jest.spyOn(service["jwtService"], "sign");

      usersServiceSpy["findOne"] = jest
        .spyOn(service["usersService"], "findOne")
        .mockResolvedValue({
          id: userId,
          email: "test@example.com",
          password: await hash("somepassword"),
          refreshToken: {
            id: "rt1",
            token: await hash(token),
            user: undefined,
          },
        });

      usersServiceSpy["update"] = jest
        .spyOn(service["usersService"], "update")
        .mockResolvedValue({
          id: userId,
          email: "test@example.com",
          password: "hashedpassword",
          refreshToken: undefined,
        });
    });

    test("success", async () => {
      await expect(testFunc(userId, token)).resolves.toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
      expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
      expect(usersServiceSpy["update"]).toHaveBeenCalled();
    });

    test("invalid token", async () => {
      await expect(testFunc(userId, "invalidToken")).resolves.toBeFalsy();

      expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
      expect(jwtServiceSpy["sign"]).not.toHaveBeenCalled();
      expect(usersServiceSpy["update"]).not.toHaveBeenCalled();
    });

    describe("Dependencies: ", () => {
      describe("usersService['findOne']", () => {
        test("returns null -> expects undefined", async () => {
          usersServiceSpy["findOne"].mockResolvedValue(null);
          await expect(testFunc(userId, token)).resolves.toBeFalsy();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).not.toHaveBeenCalled();
          expect(usersServiceSpy["update"]).not.toHaveBeenCalled();
        });

        test("returns undefined -> expects undefined", async () => {
          usersServiceSpy["findOne"].mockResolvedValue(undefined);
          await expect(testFunc(userId, token)).resolves.toBeFalsy();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).not.toHaveBeenCalled();
          expect(usersServiceSpy["update"]).not.toHaveBeenCalled();
        });

        test("throws error -> expects error", async () => {
          usersServiceSpy["findOne"].mockRejectedValue(new Error("Some error"));
          await expect(testFunc(userId, token)).rejects.toThrow();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).not.toHaveBeenCalled();
          expect(usersServiceSpy["update"]).not.toHaveBeenCalled();
        });
      });

      describe("usersService['update']", () => {
        test("returns null -> expects undefined", async () => {
          usersServiceSpy["update"].mockResolvedValue(null);

          await expect(testFunc(userId, token)).resolves.toBeFalsy();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
          expect(usersServiceSpy["update"]).toHaveBeenCalled();
        });

        test("returns undefined -> expects undefined", async () => {
          usersServiceSpy["update"].mockResolvedValue(undefined);

          await expect(testFunc(userId, token)).resolves.toBeFalsy();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
          expect(usersServiceSpy["update"]).toHaveBeenCalled();
        });

        test("throws error -> expects error", async () => {
          usersServiceSpy["update"].mockRejectedValue(new Error("Some error"));

          await expect(testFunc(userId, token)).rejects.toThrow();

          expect(usersServiceSpy["findOne"]).toHaveBeenCalled();
          expect(jwtServiceSpy["sign"]).toHaveBeenCalled();
          expect(usersServiceSpy["update"]).toHaveBeenCalled();
        });
      });
    });
  });
});

import request from "supertest";
import { App } from "supertest/types";

import { HttpStatus, INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import { LocalStrategy } from "../src/auth/strategies/local.strategy";
import { RefreshTokenStrategy } from "../src/auth/strategies/refresh-token.strategy";
import { config } from "../src/main.config";
import {
  RefreshToken,
  RefreshTokensModule,
} from "../src/refresh-tokens/index.ts";
import { User, UsersModule } from "../src/users/index.ts";
import { TestCommonModule } from "./utils/test-common.module";

describe("AuthController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestCommonModule.forRoot([User, RefreshToken]),
        UsersModule,
        RefreshTokensModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get("JWT_SECRET"),
              signOptions: {
                expiresIn: configService.get("JWT_EXPIRES_IN"),
              },
            };
          },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, LocalStrategy, RefreshTokenStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();

    config(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test("sign up a user", async () => {
    // First sign up
    const response1 = await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test" });

    expect(response1.statusCode).toBe(HttpStatus.CREATED);
    expect(response1.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );

    // Then try to sign up again with the same email
    const response2 = await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({ email: "test@example.com", password: "test" });

    expect(response2.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response2.body).toEqual(
      expect.objectContaining({
        message: "User already exists",
      }),
    );
  });

  test("sign in a user", async () => {
    // Sign up first
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test" });

    // Then sign in
    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test" });

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  test("sign in with wrong credentials", async () => {
    // Sign up first
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test" });

    // Then sign in with wrong password
    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  test("refresh a token", async () => {
    const response1 = await request(app.getHttpServer())
      .post("/auth/sign-up")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test" });

    expect(response1.statusCode).toBe(HttpStatus.CREATED);
    expect(response1.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );

    const response2 = await request(app.getHttpServer())
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${response1.body.refreshToken}`);

    expect(response2.statusCode).toBe(HttpStatus.OK);
    expect(response2.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  test("reject invalid refresh token", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/refresh-token")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });
});

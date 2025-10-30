import passport from "passport";
import request from "supertest";
import { App } from "supertest/types";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RefreshToken } from "../src/refresh-tokens";
import { User, UsersController, UsersService } from "../src/users";

describe("UsersController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [User, RefreshToken],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.use(passport.initialize());

    await app.init();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  test("create a user", async () => {
    await request(app.getHttpServer())
      .post("/users")
      .set("Accept", "application/json")
      .send({ email: "test@example.com", password: "test123" });
  });
});

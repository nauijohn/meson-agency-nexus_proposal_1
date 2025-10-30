/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory } from "@nestjs/core";

import { config } from "../main.config";

jest.mock("@nestjs/core", () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock("../main.config", () => ({
  config: jest.fn(),
}));

describe("bootstrap", () => {
  const nestFactorySpy: Record<string, jest.SpyInstance> = {};

  beforeEach(() => {
    nestFactorySpy["create"] = jest
      .spyOn(NestFactory, "create")
      .mockResolvedValue({
        listen: jest.fn((port, callback) => callback && callback()),
      } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("bootstrap resolves to undefined", async () => {
    const { bootstrap } = require("../main");

    await expect(bootstrap()).resolves.toBeUndefined();
  });

  it("should call NestFactory.create", async () => {
    const { bootstrap } = require("../main");

    await bootstrap();

    expect(nestFactorySpy["create"]).toHaveBeenCalled();
  });

  it("should call config", async () => {
    const { bootstrap } = require("../main");

    await bootstrap();

    expect(config).toHaveBeenCalled();
  });
});

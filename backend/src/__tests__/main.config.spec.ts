import { INestApplication } from "@nestjs/common";

import { config } from "../main.config";

describe("main config", () => {
  let app: Partial<INestApplication>;

  beforeEach(() => {
    app = {
      use: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      get: jest.fn(),
    };
  });

  it("should be defined", () => {
    expect(config).toBeDefined();

    expect(config(app as INestApplication)).toBeUndefined();
  });
});

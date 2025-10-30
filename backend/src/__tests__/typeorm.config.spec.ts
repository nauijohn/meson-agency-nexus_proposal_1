import { ConfigService } from "@nestjs/config";

import { typeOrmConfigFactory } from "../typeorm.config";

describe("typeOrmConfigFactory", () => {
  it("should set synchronize and autoLoadEntities to true in development", () => {
    const mockConfigService = {
      get: (key: string) => {
        const values = {
          NODE_ENV: "development",
          DB_HOST: "localhost",
          DB_PORT: "3306",
          DB_USERNAME: "user",
          DB_PASSWORD: "pass",
          DB_DATABASE: "test_db",
        };

        return values[key];
      },
    } as ConfigService;

    const config = typeOrmConfigFactory(mockConfigService);

    expect(config.synchronize).toBe(true);
    expect(config.autoLoadEntities).toBe(true);
  });

  it("should set synchronize and autoLoadEntities to false in production", () => {
    const mockConfigService = {
      get: (key: string) => {
        const values = {
          NODE_ENV: "production",
          DB_HOST: "localhost",
          DB_PORT: "3306",
          DB_USERNAME: "user",
          DB_PASSWORD: "pass",
          DB_DATABASE: "test_db",
        };
        return values[key];
      },
    } as ConfigService;

    const config = typeOrmConfigFactory(mockConfigService);

    expect(config.synchronize).toBe(false);
    expect(config.autoLoadEntities).toBe(false);
  });
});

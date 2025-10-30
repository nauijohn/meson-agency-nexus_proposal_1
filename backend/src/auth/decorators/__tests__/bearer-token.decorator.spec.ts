import { ExecutionContext } from "@nestjs/common";

import { bearerToken } from "../bearer-token.decorator";

describe("BearerToken decorator", () => {
  let mockContext: ExecutionContext;

  const contextSpy: Record<string, jest.SpyInstance> = {};

  beforeEach(() => {
    const getRequest = jest.fn();
    const switchToHttp = jest.fn().mockReturnValue({ getRequest });
    mockContext = { switchToHttp } as unknown as ExecutionContext;

    contextSpy["getRequest"] = jest.spyOn(
      mockContext.switchToHttp(),
      "getRequest",
    );
  });

  it("should return the token when Authorization header has Bearer prefix", () => {
    const req = { headers: { authorization: "Bearer my-token-123" } };
    contextSpy["getRequest"].mockReturnValue(req);

    expect(bearerToken(null, mockContext)).toBe("my-token-123");
  });

  it("should return null when Authorization header is missing", () => {
    const req = { headers: {} };
    contextSpy["getRequest"].mockReturnValue(req);

    expect(bearerToken(null, mockContext)).toBeNull();
  });

  it("should return null when Authorization header does not start with Bearer", () => {
    const req = { headers: { authorization: "Token abc123" } };
    contextSpy["getRequest"].mockReturnValue(req);

    expect(bearerToken(null, mockContext)).toBeNull();
  });
});

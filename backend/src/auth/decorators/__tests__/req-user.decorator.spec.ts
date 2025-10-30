import { ExecutionContext } from "@nestjs/common";

import { User } from "../../../users";
import { reqUser } from "../req-user.decorator";

describe("ReqUser decorator", () => {
  let mockContext: ExecutionContext;

  const testFunc = (context: ExecutionContext) => reqUser(null, context);

  const contextSpy: Record<string, jest.SpyInstance> = {};

  const user: User = {
    id: "d5574d32-9079-4161-81ee-29b402fd461d",
    email: "test@example.com",
    password: "hashedpassword",
  };

  beforeEach(() => {
    const getRequest = jest.fn();
    const switchToHttp = jest.fn().mockReturnValue({ getRequest });
    mockContext = { switchToHttp } as unknown as ExecutionContext;

    contextSpy["getRequest"] = jest.spyOn(
      mockContext.switchToHttp(),
      "getRequest",
    );
  });

  it("should return a user", () => {
    contextSpy["getRequest"].mockReturnValue({
      user,
    });

    expect(testFunc(mockContext)).toBe(user);
  });

  it("should return null", () => {
    contextSpy["getRequest"].mockReturnValue({ user: null });

    expect(testFunc(mockContext)).toBeNull();
  });
});

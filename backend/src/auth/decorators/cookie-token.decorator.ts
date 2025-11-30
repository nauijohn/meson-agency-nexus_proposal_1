import type { Request } from "express";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const cookieToken = (
  data: unknown,
  context: ExecutionContext,
): string | null => {
  const req = context.switchToHttp().getRequest<Request>();
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return null;
  }
  return cookies.refreshToken as string;
};

export const CookieToken = createParamDecorator(cookieToken);

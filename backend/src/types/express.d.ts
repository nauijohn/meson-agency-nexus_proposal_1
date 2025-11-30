import { JwtUser } from "../auth/entities/jwt-user.entity";

class Cookies {
  refreshToken: string;
}

declare module "express" {
  interface Request {
    user: JwtUser; // keep optional globally
    cookies: Cookies;
  }
}

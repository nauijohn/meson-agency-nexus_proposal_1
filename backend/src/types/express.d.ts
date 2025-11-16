import { JwtUser } from "../auth/entities/jwt-user.entity";

declare module "express" {
  interface Request {
    user: JwtUser; // keep optional globally
  }
}

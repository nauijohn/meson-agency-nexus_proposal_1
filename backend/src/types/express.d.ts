import { User } from "../users/index.ts";

declare module "express" {
  interface Request {
    user: User; // keep optional globally
  }
}

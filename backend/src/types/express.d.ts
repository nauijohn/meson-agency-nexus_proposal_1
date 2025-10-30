import { User } from "../users";

declare module "express" {
  interface Request {
    user: User; // keep optional globally
  }
}

import { ExecutionContext, Injectable } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

import { JwtUser } from "../entities/jwt-user.entity";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(
    err: Error,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log("JWT REFRESH TOKEN HandleRequest Guard");

    console.log("user: ", user);
    console.log("status: ", status);

    if (status) {
      console.log("status: ", status);
    }

    if (info) {
      if (info instanceof JsonWebTokenError) {
        console.log("info: ", info);
        throw info;
      }

      if (
        !(info instanceof TokenExpiredError) &&
        !(info instanceof JsonWebTokenError)
      ) {
        console.log("info: ", info);
      }
    }

    if (err) {
      console.log("err: ", err);
      throw err;
    }

    // if (!user) throw new TokenExpiredError("Token expired", new Date());
    if (!user) throw new TokenExpiredError("test", new Date());

    return user as TUser;
  }
}

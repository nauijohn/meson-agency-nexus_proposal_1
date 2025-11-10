import { Observable } from "rxjs";

import { ExecutionContext, Injectable } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";
import { JwtUser } from "../strategies";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.warn("JWT Auth Guard: canActivate called...");
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(
    err: Error,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log("JWT HandleRequest Guard");

    if (status) {
      console.log("status: ", status);
    }

    if (info) {
      if (info instanceof JsonWebTokenError) {
        throw info;
      }

      if (!TokenExpiredError && !JsonWebTokenError) {
        console.log("info: ", info);
      }
    }

    if (err) {
      console.log("err: ", err);
      throw err;
    }

    if (!user) throw new TokenExpiredError("Token expired", new Date());

    return user as TUser;
  }
}

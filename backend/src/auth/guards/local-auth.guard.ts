import { Observable } from "rxjs";

import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";
import { User } from "../../users/";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.verbose("LocalAuthGuard: canActivate");

    return super.canActivate(context);
  }

  handleRequest<TUser = User>(
    err: Error,
    user: TUser,
    info: { message: string } | undefined,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    this.logger.warn("LocalAuthGuard: handleRequest called...");
    this.logger.log("info: ", info);
    this.logger.log("status: ", status);

    this.logger.log("user: ", user);
    this.logger.log("err: ", err);

    if (err) {
      this.logger.error("Throwing error from LocalAuthGuard");
      throw err;
    }

    if (!user) throw new InternalServerErrorException();

    return user;
  }
}

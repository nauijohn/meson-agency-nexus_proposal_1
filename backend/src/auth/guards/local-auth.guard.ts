import { Observable } from "rxjs";

import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { User } from "../../users/";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("LocalAuthGuard: canActivate");

    return super.canActivate(context);
  }

  handleRequest<TUser = User>(
    err: Error,
    user: TUser,
    info: { message: string } | undefined,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log("info: ", info);
    console.log("status: ", status);

    console.log("user: ", user);
    console.log("err: ", err);

    if (err) {
      console.log("Throwing error from LocalAuthGuard");
      throw err;
    }

    if (!user) throw new InternalServerErrorException();

    return user;
  }
}

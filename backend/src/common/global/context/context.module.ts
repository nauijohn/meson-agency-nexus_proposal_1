import type { Request } from "express";

import { Global, Module, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { CLS_USER_ID } from "../../constants";

@Global()
@Module({
  providers: [
    {
      provide: CLS_USER_ID,
      inject: [REQUEST],
      scope: Scope.REQUEST,
      useFactory: (req: Request) => {
        return () => req.user.id;
      },
    },
  ],
  exports: [CLS_USER_ID],
})
export class ContextModule {}

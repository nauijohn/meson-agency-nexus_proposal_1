import { Request } from "express";
import { Observable } from "rxjs";

import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import {
  CHECK_ABILITY,
  RequiredRule,
} from "../decorators/check-abilities.decorator";
import { JwtUser } from "../entities/jwt-user.entity";
import { CaslAbilityFactory } from "../permissions/casl-ability.factory";

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest<Request>();

    const ability = this.caslAbilityFactory.createForUser(
      user as unknown as JwtUser,
    );

    rules.forEach((rule) => {
      ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
    });

    return true;
  }
}

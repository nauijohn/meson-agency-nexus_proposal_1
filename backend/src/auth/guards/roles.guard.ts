import { Request } from "express";

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { LoggerService } from "../../common/global/logger/logger.service";
import { RoleType } from "../../roles/entities";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.verbose("Roles Guard: canActivate called...");
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.error("Required Roles:", requiredRoles);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as { roles: RoleType[] | undefined };

    const roles = user?.roles;

    const hasRole = requiredRoles.some((role) => roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(", ")}`,
      );
    }

    return true;
  }
}

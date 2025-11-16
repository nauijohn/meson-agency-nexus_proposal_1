import type { Request } from "express";
import { CLS_REQ, ClsService } from "nestjs-cls";

import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements NestLoggerService {
  public parentClassName: string;
  public methodName: string;

  constructor(
    private readonly cls: ClsService,
    @Inject(INQUIRER)
    private readonly parentClass: object,
  ) {
    super();

    this.parentClassName = this.parentClass?.constructor?.name
      ? `[${this.parentClass?.constructor?.name}]`
      : "";
  }

  log(message: string, data?: any) {
    super.log(this.format("log", message, data));
  }

  verbose(message: string, data?: any) {
    super.verbose(this.format("verbose", message, data));
  }

  debug(message: string, data?: any) {
    super.debug(this.format("debug", message, data));
  }

  warn(message: string, data?: any) {
    super.warn(this.format("warn", message, data));
  }

  error(message: string, data?: any) {
    super.error(this.format("error", message, data));
  }

  private format(
    type: "log" | "warn" | "error" | "verbose" | "debug",
    message: string,
    data: any,
  ): string {
    return `${this.requestIdSection}${this.urlSection}${this.parentClassSection}${this.method} ${this.dataSection(type, message, data)}`;
  }

  private get method() {
    return this.methodName ? `[${this.methodName}]` : "";
  }

  private parseData(message: string, data: any): string {
    if (typeof data === "object") data = `${JSON.stringify(data, null, 0)}`;
    if (typeof data === "boolean") data = String(data);
    return data ? `${message}: ${data}` : message;
  }

  private get requestIdSection() {
    const requestId = this.cls.getId() ? `[${this.cls.getId()}]` : "";
    return this.colorize(requestId, "verbose");
  }

  private get urlSection() {
    const req: Request = this.cls.get(CLS_REQ);
    const url = req ? `[${req.method} ${req.originalUrl}]` : "";
    return this.colorize(url, "debug");
  }

  private get parentClassSection() {
    return this.colorize(this.parentClassName, "warn");
  }

  private dataSection(
    type: "log" | "warn" | "error" | "verbose" | "debug",
    message: string,
    data: any,
  ) {
    return this.colorize(this.parseData(message, data), type);
  }
}

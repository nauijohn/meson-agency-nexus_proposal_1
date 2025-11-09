import { Response } from "express";
import { ClsService } from "nestjs-cls";

type AsyncMethod = (...args: unknown[]) => Promise<unknown>;

interface ResponsefulService {
  response: Response;
  cls: ClsService;
}

export function SetPaginationHeaders() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as AsyncMethod;

    const proxyMethod = async function (
      this: ResponsefulService,
      ...args: unknown[]
    ) {
      console.log("SetPaginationHeaders decorator triggered...");
      const result = (await originalMethod.apply(this, args)) as AsyncMethod;

      console.log("args: ", args);

      if (this.response && this.cls) {
        this.cls.get<number>("total");
        this.response.setHeader("total", this.cls.get<number>("total"));
      } else {
        console.log("No services to set pagination headers...");
      }
      return result;
    };

    descriptor.value = proxyMethod;
    return descriptor;
  };
}

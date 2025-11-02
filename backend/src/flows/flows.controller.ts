import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { FlowActivitiesService } from "../flow-activities/flow-activities.service";
import { FlowStepActivitiesService } from "../flow-step-activities/flow-step-activities.service";
import { FlowStepsService } from "../flow_steps/flow-steps.service";
import { CreateFlowDto } from "./dto/create-flow.dto";
import { UpdateFlowDto } from "./dto/update-flow.dto";
import { FlowsService } from "./flows.service";

@Controller("flows")
export class FlowsController {
  constructor(
    private readonly flowsService: FlowsService,
    private readonly flowStepsService: FlowStepsService,
    private readonly flowActivitiesService: FlowActivitiesService,
    private readonly flowStepActivitiesService: FlowStepActivitiesService,
  ) {}

  @Post()
  async create(@Body() dto: CreateFlowDto) {
    const steps = await Promise.all(
      dto.steps
        ? dto.steps.map(async (step) => {
            const stepActivities = await Promise.all(
              step.activities?.map(async (activity) => {
                return this.flowStepActivitiesService.create({
                  activity: await this.flowActivitiesService.create({
                    id: activity,
                  }),
                });
              }),
            );
            return this.flowStepsService.create(
              {
                name: step.name,
                order: step.order,
                stepActivities: stepActivities,
              },
              false,
            );
          })
        : [],
    );
    console.log(steps);

    return this.flowsService.create({
      name: dto.name,
      steps,
    });
  }

  @Get()
  async findAll() {
    return await this.flowsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const entity = await this.flowsService.findOne(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateFlowDto) {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, dto);
    return this.flowsService.update(updated);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.flowsService.delete(id);
  }
}

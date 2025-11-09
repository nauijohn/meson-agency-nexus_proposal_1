import { setSeederFactory } from "typeorm-extension";

import {
  ActivityType,
  FlowActivity,
} from "../../../src/flow-activities/entities/flow-activity.entity";

export const FlowActivityFactory = setSeederFactory(FlowActivity, (faker) => {
  const flowActivity = new FlowActivity();
  flowActivity.name = faker.lorem.sentence();
  flowActivity.type = ActivityType.voice;
  flowActivity.createdAt = faker.date.past();
  flowActivity.updatedAt = faker.date.recent();
  return flowActivity;
});

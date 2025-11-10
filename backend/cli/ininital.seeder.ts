import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import {
  ActivityType,
  FlowActivity,
} from "../src/flow-activities/entities/flow-activity.entity";

export class InitialSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log("Running FlowActivitiesSeeder...");
    const flowActivityRepo = dataSource.getRepository(FlowActivity);

    let activityTypes = [
      {
        name: "Voice",
        type: ActivityType.voice,
      },
      {
        name: "Email",
        type: ActivityType.email,
      },
      {
        name: "SMS",
        type: ActivityType.sms,
      },
      {
        name: "Task",
        type: ActivityType.task,
      },
      {
        name: "Webhook",
        type: ActivityType.webhook,
      },
    ];
    const existingActivities = await flowActivityRepo.find();
    existingActivities.forEach((activity) => {
      activityTypes = activityTypes.filter((at) => at.type !== activity.type);
    });

    if (activityTypes.length !== 0) await flowActivityRepo.save(activityTypes);
  }
}

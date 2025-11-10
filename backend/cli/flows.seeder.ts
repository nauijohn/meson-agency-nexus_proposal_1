import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { FlowActivity } from "../src/flow-activities/entities/flow-activity.entity";
import { FlowStepActivity } from "../src/flow-step-activities/entities/flow-step-activity.entity";
import { FlowStep } from "../src/flow_steps/entities/flow-step.entity";
import { Flow } from "../src/flows/entities/flow.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

// function shuffleArray<T>(array: T[]) {
//   const arrCopy = [...array]; // copy to avoid mutating original
//   for (let i = arrCopy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
//   }
//   return arrCopy;
// }

export class FlowsSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log("Running FlowsSeeder...");
    const flowActivitiesRepo = dataSource.getRepository(FlowActivity);
    const flowActivities = await flowActivitiesRepo.find();

    const flowStepFactory = factoryManager.get(FlowStep);
    const flowStepActivityFactory = factoryManager.get(FlowStepActivity);
    const flowFactory = factoryManager.get(Flow);

    const FLOW_COUNT = 10;

    await Promise.all(
      Array.from({ length: FLOW_COUNT }).map(async () => {
        const flow = await flowFactory.save();
        const FLOW_STEP_COUNT = faker.number.int({ min: 1, max: 3 });
        await Promise.all(
          Array.from({ length: FLOW_STEP_COUNT }).map(async (_, i) => {
            const FLOW_STEP_ACTIVITY_COUNT = faker.number.int({
              min: 1,
              max: 5,
            });
            return flowStepFactory.save({
              flow: flow,
              order: i + 1,
              stepActivities: await Promise.all(
                Array.from({ length: FLOW_STEP_ACTIVITY_COUNT }).map(() =>
                  flowStepActivityFactory.save({
                    activity:
                      flowActivities[
                        faker.number.int({
                          min: 0,
                          max: flowActivities.length - 1,
                        })
                      ],
                  }),
                ),
              ),
            });
          }),
        );
      }),
    );
  }
}

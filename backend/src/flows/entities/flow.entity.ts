import { Entity } from "typeorm";

import { FlowRelationsEntity } from "./flow-relations.entity";

@Entity({ name: "flows" })
export class Flow extends FlowRelationsEntity {}

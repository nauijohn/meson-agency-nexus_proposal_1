export enum CampaignEvents {
  Created = "campaign.created",
  Updated = "campaign.updated",
  FlowAssigned = "campaign.flow-assigned",
  FlowUnassigned = "campaign.flow-unassigned",
  FlowReassigned = "campaign.flow-reassigned",
}

export class CampaignFlowAssignedEvent {
  public readonly campaignId: string;
  public readonly flow: {
    id: string;
    flowSteps?: {
      flowStepId?: string;
      scheduledAt?: Date;
      dueAt?: Date;
    }[];
  };

  constructor(data: {
    campaignId: string;
    flow: {
      id: string;
      flowSteps?: {
        flowStepId?: string;
        scheduledAt?: Date;
        dueAt?: Date;
      }[];
    };
  }) {
    this.campaignId = data.campaignId;
    this.flow = data.flow;
  }
}
